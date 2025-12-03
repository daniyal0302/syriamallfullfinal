import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Loader2, User, Phone, ShieldOff, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface UserWithRoles {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  roles: string[];
}

export default function AdminUsers() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showRemoveAdminDialog, setShowRemoveAdminDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles: UserWithRoles[] = (profiles || []).map((profile) => {
        const userRoles = (roles || []).filter((r) => r.user_id === profile.id);
        return {
          ...profile,
          roles: userRoles.map((r) => r.role),
        };
      });

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user: UserWithRoles) => {
    setSelectedUser(user);
    setShowDialog(true);
  };

  const handleRemoveAdminRole = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    try {
      // Delete the admin role from user_roles
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", selectedUser.id)
        .eq("role", "admin");

      if (error) throw error;

      toast({
        title: "Success",
        description: `Admin role removed from ${selectedUser.full_name || "user"}`,
      });

      setShowRemoveAdminDialog(false);
      setShowDialog(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error("Error removing admin role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove admin role",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "vendor":
        return "default";
      default:
        return "outline";
    }
  };

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
          <h1 className="text-3xl font-heading font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage platform users and their accounts</p>
        </div>
        <Button variant="outline" onClick={fetchUsers} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {user.full_name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {user.phone || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {user.roles.length > 0 ? (
                          user.roles.map((role: string) => (
                            <Badge key={role} variant={getRoleBadgeVariant(role)}>
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline">No roles</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete user information and role management</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-bold">Full Name</Label>
                  <p>{selectedUser.full_name || "N/A"}</p>
                </div>
                <div>
                  <Label className="font-bold">Phone</Label>
                  <p>{selectedUser.phone || "N/A"}</p>
                </div>
                <div>
                  <Label className="font-bold">User ID</Label>
                  <p className="text-xs text-muted-foreground font-mono">{selectedUser.id}</p>
                </div>
                <div>
                  <Label className="font-bold">Roles</Label>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {selectedUser.roles.length > 0 ? (
                      selectedUser.roles.map((role: string) => (
                        <Badge key={role} variant={getRoleBadgeVariant(role)}>
                          {role}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">No roles</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="font-bold">Joined</Label>
                  <p>{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Admin Role Management */}
              {selectedUser.roles.includes("admin") && selectedUser.id !== currentUser?.id && (
                <div className="pt-4 border-t">
                  <Label className="font-bold text-destructive">Danger Zone</Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    Remove admin privileges from this user. This action can be reversed by a super admin.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setShowRemoveAdminDialog(true)}
                  >
                    <ShieldOff className="h-4 w-4 mr-2" />
                    Remove Admin Role
                  </Button>
                </div>
              )}

              {selectedUser.id === currentUser?.id && selectedUser.roles.includes("admin") && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    You cannot remove your own admin role.
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showRemoveAdminDialog} onOpenChange={setShowRemoveAdminDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Admin Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove admin privileges from{" "}
              <strong>{selectedUser?.full_name || "this user"}</strong>? 
              They will no longer have access to the admin dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAdminRole}
              disabled={actionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove Admin Role"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
