import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Check, X, Eye, Ban, Loader2, RefreshCw, CheckCircle, ExternalLink } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Vendor {
  id: string;
  user_id: string;
  store_name: string;
  email: string | null;
  phone: string | null;
  is_approved: boolean | null;
  commission_rate: number | null;
  wallet_balance: number | null;
  created_at: string;
  productCount: number;
  vendor_application?: {
    business_license_url?: string;
    ntn_certificate_url?: string;
    id_proof_url?: string;
    bank_statement_url?: string;
  } | null;
}

export default function AdminVendors() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("vendors")
        .select(`
          id,
          user_id,
          store_name,
          email,
          phone,
          is_approved,
          commission_rate,
          wallet_balance,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch product counts and applications separately
      const vendorsWithData = await Promise.all(
        (data || []).map(async (vendor) => {
          const { count } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("vendor_id", vendor.id);

          // Fetch application documents
          const { data: appData } = await supabase
            .from("vendor_applications")
            .select("business_license_url, ntn_certificate_url, id_proof_url, bank_statement_url")
            .eq("user_id", vendor.user_id)
            .maybeSingle();

          return { 
            ...vendor, 
            productCount: count || 0,
            vendor_application: appData
          };
        })
      );

      setVendors(vendorsWithData);
    } catch (error: any) {
      console.error("Error fetching vendors:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendor: Vendor) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("vendors")
        .update({ is_approved: true })
        .eq("id", vendor.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${vendor.store_name} has been approved`,
      });

      fetchVendors();
    } catch (error: any) {
      console.error("Error approving vendor:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve vendor",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setShowApprovalDialog(false);
      setSelectedVendor(null);
    }
  };

  const handleReject = async (vendor: Vendor) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("vendors")
        .delete()
        .eq("id", vendor.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${vendor.store_name} has been rejected and removed`,
      });

      fetchVendors();
    } catch (error: any) {
      console.error("Error rejecting vendor:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject vendor",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setShowApprovalDialog(false);
      setSelectedVendor(null);
    }
  };

  const handleSuspend = async (vendor: Vendor) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("vendors")
        .update({ is_approved: false })
        .eq("id", vendor.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${vendor.store_name} has been suspended`,
      });

      fetchVendors();
    } catch (error: any) {
      console.error("Error suspending vendor:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to suspend vendor",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async (vendor: Vendor) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("vendors")
        .update({ is_approved: true })
        .eq("id", vendor.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${vendor.store_name} has been activated`,
      });

      fetchVendors();
    } catch (error: any) {
      console.error("Error activating vendor:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to activate vendor",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (isApproved: boolean | null) => {
    if (isApproved === true) {
      return <Badge className="bg-green-600">Active</Badge>;
    }
    if (isApproved === false) {
      return <Badge variant="destructive">Suspended</Badge>;
    }
    return <Badge className="bg-primary">Pending</Badge>;
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.store_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingVendors = filteredVendors.filter(v => v.is_approved === null);
  const activeVendors = filteredVendors.filter(v => v.is_approved === true);
  const suspendedVendors = filteredVendors.filter(v => v.is_approved === false);

  const VendorRow = ({ vendor }: { vendor: Vendor }) => (
    <TableRow key={vendor.id}>
      <TableCell className="font-medium">{vendor.store_name}</TableCell>
      <TableCell>
        <div className="text-sm">
          <div>{vendor.email || "N/A"}</div>
          <div className="text-muted-foreground">{vendor.phone || "N/A"}</div>
        </div>
      </TableCell>
      <TableCell>{new Date(vendor.created_at).toLocaleDateString()}</TableCell>
      <TableCell>{vendor.productCount}</TableCell>
      <TableCell>{getStatusBadge(vendor.is_approved)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedVendor(vendor);
              setShowApprovalDialog(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {vendor.is_approved !== true && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleApprove(vendor)}
              disabled={actionLoading}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          {vendor.is_approved === null && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleReject(vendor)}
              disabled={actionLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {vendor.is_approved === true && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSuspend(vendor)}
              disabled={actionLoading}
              className="text-destructive hover:text-destructive"
            >
              <Ban className="h-4 w-4" />
            </Button>
          )}
          {vendor.is_approved === false && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleActivate(vendor)}
              disabled={actionLoading}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">Vendor Management</h1>
          <p className="text-muted-foreground">Manage vendor approvals and accounts</p>
        </div>
        <Button variant="outline" onClick={fetchVendors} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Vendors ({filteredVendors.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingVendors.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeVendors.length})</TabsTrigger>
          <TabsTrigger value="suspended">Suspended ({suspendedVendors.length})</TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="all" className="m-0">
              {filteredVendors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No vendors found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVendors.map((vendor) => (
                      <VendorRow key={vendor.id} vendor={vendor} />
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="pending" className="m-0">
              {pendingVendors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending vendors
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingVendors.map((vendor) => (
                      <VendorRow key={vendor.id} vendor={vendor} />
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="active" className="m-0">
              {activeVendors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active vendors
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeVendors.map((vendor) => (
                      <VendorRow key={vendor.id} vendor={vendor} />
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="suspended" className="m-0">
              {suspendedVendors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No suspended vendors
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suspendedVendors.map((vendor) => (
                      <VendorRow key={vendor.id} vendor={vendor} />
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
            <DialogDescription>
              Review vendor information and documents
            </DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-bold">Store Name</Label>
                  <p>{selectedVendor.store_name}</p>
                </div>
                <div>
                  <Label className="font-bold">Email</Label>
                  <p>{selectedVendor.email || "N/A"}</p>
                </div>
                <div>
                  <Label className="font-bold">Phone</Label>
                  <p>{selectedVendor.phone || "N/A"}</p>
                </div>
                <div>
                  <Label className="font-bold">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedVendor.is_approved)}</div>
                </div>
                <div>
                  <Label className="font-bold">Products</Label>
                  <p>{selectedVendor.productCount}</p>
                </div>
                <div>
                  <Label className="font-bold">Commission Rate</Label>
                  <p>{selectedVendor.commission_rate || 10}%</p>
                </div>
                <div>
                  <Label className="font-bold">Wallet Balance</Label>
                  <p>${selectedVendor.wallet_balance?.toFixed(2) || "0.00"}</p>
                </div>
                <div>
                  <Label className="font-bold">Joined</Label>
                  <p>{new Date(selectedVendor.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedVendor.vendor_application && (
                <div className="space-y-4">
                  <Label className="font-bold text-lg">KYC Documents</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedVendor.vendor_application.business_license_url && (
                      <div>
                        <Label>Business License</Label>
                        <Button variant="outline" size="sm" className="w-full mt-1" asChild>
                          <a href={selectedVendor.vendor_application.business_license_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Document
                          </a>
                        </Button>
                      </div>
                    )}
                    {selectedVendor.vendor_application.ntn_certificate_url && (
                      <div>
                        <Label>NTN Certificate</Label>
                        <Button variant="outline" size="sm" className="w-full mt-1" asChild>
                          <a href={selectedVendor.vendor_application.ntn_certificate_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Document
                          </a>
                        </Button>
                      </div>
                    )}
                    {selectedVendor.vendor_application.id_proof_url && (
                      <div>
                        <Label>ID Proof</Label>
                        <Button variant="outline" size="sm" className="w-full mt-1" asChild>
                          <a href={selectedVendor.vendor_application.id_proof_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Document
                          </a>
                        </Button>
                      </div>
                    )}
                    {selectedVendor.vendor_application.bank_statement_url && (
                      <div>
                        <Label>Bank Statement</Label>
                        <Button variant="outline" size="sm" className="w-full mt-1" asChild>
                          <a href={selectedVendor.vendor_application.bank_statement_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Document
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <Label className="font-bold">Admin Notes</Label>
                <Textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add notes about this vendor..."
                  className="mt-1"
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Close
            </Button>
            {selectedVendor?.is_approved !== true && (
              <Button
                variant="default"
                onClick={() => selectedVendor && handleApprove(selectedVendor)}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                Approve
              </Button>
            )}
            {selectedVendor?.is_approved === true && (
              <Button
                variant="destructive"
                onClick={() => selectedVendor && handleSuspend(selectedVendor)}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Ban className="h-4 w-4 mr-2" />}
                Suspend
              </Button>
            )}
            {selectedVendor?.is_approved === false && (
              <Button
                variant="default"
                onClick={() => selectedVendor && handleActivate(selectedVendor)}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Activate
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
