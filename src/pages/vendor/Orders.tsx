// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Eye, Download } from "lucide-react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { useState } from "react";

// const mockOrders = [
//   { id: "ORD-20250118-000001", customer: "John Doe", total: 245.99, status: "pending", items: 3 },
//   { id: "ORD-20250118-000002", customer: "Jane Smith", total: 189.50, status: "processing", items: 2 },
//   { id: "ORD-20250117-000045", customer: "Mike Johnson", total: 432.00, status: "shipped", items: 5 },
//   { id: "ORD-20250117-000042", customer: "Sarah Wilson", total: 156.75, status: "completed", items: 1 },
// ];

// const statusColors: Record<string, string> = {
//   pending: "bg-yellow-500",
//   processing: "bg-blue-500",
//   shipped: "bg-purple-500",
//   completed: "bg-green-500",
//   cancelled: "bg-red-500",
//   returned: "bg-orange-500",
// };

// export default function VendorOrders() {
//   const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
//   const [orderNotes, setOrderNotes] = useState<Record<string, string>>({});

//   const handleStatusChange = (orderId: string, newStatus: string) => {
//     console.log(`Order ${orderId} status changed to ${newStatus}`);
//   };

//   const handleNotesChange = (orderId: string, notes: string) => {
//     setOrderNotes(prev => ({ ...prev, [orderId]: notes }));
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Orders Management</h1>
//         <p className="text-muted-foreground">Manage and track all your orders</p>
//       </div>

//       <Tabs defaultValue="all" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="all">All Orders</TabsTrigger>
//           <TabsTrigger value="pending">Pending</TabsTrigger>
//           <TabsTrigger value="processing">Processing</TabsTrigger>
//           <TabsTrigger value="shipped">Shipped</TabsTrigger>
//           <TabsTrigger value="completed">Completed</TabsTrigger>
//           <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
//         </TabsList>

//         <TabsContent value="all" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>All Orders</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {mockOrders.map((order) => (
//                   <div key={order.id} className="border rounded-lg p-4 space-y-4">
//                     <div className="flex items-start justify-between">
//                       <div className="space-y-1">
//                         <p className="font-bold">{order.id}</p>
//                         <p className="text-sm text-muted-foreground">Customer: {order.customer}</p>
//                         <p className="text-sm text-muted-foreground">{order.items} items</p>
//                       </div>
//                       <div className="text-right space-y-2">
//                         <p className="font-bold">${order.total}</p>
//                         <Select 
//                           defaultValue={order.status}
//                           onValueChange={(value) => handleStatusChange(order.id, value)}
//                         >
//                           <SelectTrigger className="w-[140px]">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="pending">Pending</SelectItem>
//                             <SelectItem value="processing">Processing</SelectItem>
//                             <SelectItem value="shipped">Shipped</SelectItem>
//                             <SelectItem value="completed">Completed</SelectItem>
//                             <SelectItem value="cancelled">Cancelled</SelectItem>
//                             <SelectItem value="returned">Returned</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
                    
//                     {selectedOrder === order.id && (
//                       <div className="space-y-3 pt-3 border-t">
//                         <div>
//                           <label className="text-sm font-medium">Vendor Notes</label>
//                           <Textarea 
//                             placeholder="Add notes for shipping or admin..."
//                             value={orderNotes[order.id] || ""}
//                             onChange={(e) => handleNotesChange(order.id, e.target.value)}
//                             rows={3}
//                             className="mt-1"
//                           />
//                         </div>
//                         <div className="flex gap-2">
//                           <Button size="sm" variant="outline">Save Notes</Button>
//                           <Button size="sm" variant="outline" onClick={() => setSelectedOrder(null)}>
//                             Close
//                           </Button>
//                         </div>
//                       </div>
//                     )}

//                     <div className="flex gap-2">
//                       <Button 
//                         size="sm" 
//                         variant="outline"
//                         onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
//                       >
//                         <Eye className="h-4 w-4 mr-2" />
//                         {selectedOrder === order.id ? "Hide" : "View"} Details
//                       </Button>
//                       <Button size="sm" variant="outline">
//                         <Download className="h-4 w-4 mr-2" />
//                         Invoice
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Download, Loader2, Package } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  total: number;
  subtotal: number;
  shipping_cost: number | null;
  status: string | null;
  payment_status: string | null;
  payment_method: string | null;
  shipping_address: any;
  vendor_notes: string | null;
  created_at: string | null;
  customer_profile?: { full_name: string | null; phone: string | null } | null;
  order_items?: { id: string; product_name: string; quantity: number; unit_price: number; subtotal: number }[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  processing: "bg-blue-500",
  shipped: "bg-purple-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
  returned: "bg-orange-500",
};

export default function VendorOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orderNotes, setOrderNotes] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data: vendorData } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user!.id)
        .single();

      if (!vendorData) return;

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (id, product_name, quantity, unit_price, subtotal)
        `)
        .eq("vendor_id", vendorData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch customer profiles separately
      const customerIds = [...new Set((data || []).map(o => o.customer_id).filter(Boolean))] as string[];
      let profilesMap: Record<string, { full_name: string | null; phone: string | null }> = {};
      if (customerIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, phone")
          .in("id", customerIds);
        profiles?.forEach(p => { profilesMap[p.id] = p; });
      }

      const enriched = (data || []).map(o => ({
        ...o,
        customer_profile: o.customer_id ? profilesMap[o.customer_id] || null : null,
      }));

      setOrders(enriched);
      // Populate notes
      const notes: Record<string, string> = {};
      enriched.forEach(o => { if (o.vendor_notes) notes[o.id] = o.vendor_notes; });
      setOrderNotes(notes);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleSaveNotes = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ vendor_notes: orderNotes[orderId] || "" })
        .eq("id", orderId);
      if (error) throw error;
      toast.success("Notes saved");
    } catch {
      toast.error("Failed to save notes");
    }
  };

  const filtered = activeTab === "all" ? orders : orders.filter(o => o.status === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-muted-foreground">Manage and track all your orders</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({orders.filter(o => o.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="processing">Processing ({orders.filter(o => o.status === "processing").length})</TabsTrigger>
          <TabsTrigger value="shipped">Shipped ({orders.filter(o => o.status === "shipped").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({orders.filter(o => o.status === "completed").length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({orders.filter(o => o.status === "cancelled").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No orders found</p>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{activeTab === "all" ? "All" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filtered.map((order) => {
                    const addr = order.shipping_address as any;
                    return (
                      <div key={order.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-bold">{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              Customer: {order.customer_profile?.full_name || addr?.full_name || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Phone: {order.customer_profile?.phone || addr?.phone || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.order_items?.length || 0} item(s) • {order.payment_method || "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.created_at ? new Date(order.created_at).toLocaleString() : ""}
                            </p>
                          </div>
                          <div className="text-right space-y-2">
                            <p className="font-bold">${Number(order.total).toFixed(2)}</p>
                            <Badge className={statusColors[order.payment_status || ""] || "bg-muted"}>
                              {order.payment_status || "unknown"}
                            </Badge>
                            <Select
                              value={order.status || "pending"}
                              onValueChange={(value) => handleStatusChange(order.id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="returned">Returned</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {selectedOrder === order.id && (
                          <div className="space-y-3 pt-3 border-t">
                            {/* Order Items */}
                            <div>
                              <h4 className="text-sm font-medium mb-2">Items</h4>
                              <div className="space-y-1">
                                {order.order_items?.map(item => (
                                  <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.product_name} × {item.quantity}</span>
                                    <span>${Number(item.subtotal).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Address */}
                            {addr && (
                              <div>
                                <h4 className="text-sm font-medium mb-1">Shipping Address</h4>
                                <p className="text-sm text-muted-foreground">
                                  {addr.street_address}{addr.building_unit ? `, ${addr.building_unit}` : ""}<br />
                                  {addr.city}, {addr.state_province} {addr.postal_code}<br />
                                  {addr.country}
                                </p>
                              </div>
                            )}

                            {/* Vendor Notes */}
                            <div>
                              <label className="text-sm font-medium">Vendor Notes</label>
                              <Textarea
                                placeholder="Add notes for shipping or admin..."
                                value={orderNotes[order.id] || ""}
                                onChange={(e) => setOrderNotes(prev => ({ ...prev, [order.id]: e.target.value }))}
                                rows={3}
                                className="mt-1"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleSaveNotes(order.id)}>
                                Save Notes
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setSelectedOrder(null)}>
                                Close
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {selectedOrder === order.id ? "Hide" : "View"} Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

