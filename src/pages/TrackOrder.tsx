// import { useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { supabase } from "@/integrations/supabase/client";
// import { Search, Package, Truck, CheckCircle, Clock, XCircle, AlertCircle, MapPin } from "lucide-react";
// import { toast } from "sonner";

// interface OrderData {
//   id: string;
//   order_number: string;
//   status: string;
//   created_at: string;
//   total: number;
//   shipping_address: {
//     full_name?: string;
//     city?: string;
//     country?: string;
//   };
// }

// const TrackOrder = () => {
//   const [searchParams] = useSearchParams();
//   const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
//   const [order, setOrder] = useState<OrderData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [searched, setSearched] = useState(false);

//   const handleTrackOrder = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!orderNumber.trim()) {
//       toast.error("Please enter an order number");
//       return;
//     }

//     setLoading(true);
//     setSearched(true);

//     const { data, error } = await supabase
//       .from("orders")
//       .select("id, order_number, status, created_at, total, shipping_address")
//       .eq("order_number", orderNumber.trim().toUpperCase())
//       .maybeSingle();

//     setLoading(false);

//     if (error) {
//       toast.error("Error tracking order");
//       return;
//     }

//     if (data) {
//       setOrder(data as OrderData);
//     } else {
//       setOrder(null);
//       toast.error("Order not found. Please check the order number and try again.");
//     }
//   };

//   const statusFlow = ["pending", "processing", "shipped", "delivered"];
//   const currentIndex = order ? statusFlow.indexOf(order.status || "pending") : -1;

//   const timelineItems = [
//     { status: "pending", label: "Order Placed", icon: Clock },
//     { status: "processing", label: "Processing", icon: Package },
//     { status: "shipped", label: "Shipped", icon: Truck },
//     { status: "delivered", label: "Delivered", icon: CheckCircle },
//   ];

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "pending":
//         return <Badge variant="secondary">Pending</Badge>;
//       case "processing":
//         return <Badge className="bg-blue-500">Processing</Badge>;
//       case "shipped":
//         return <Badge className="bg-orange-500">Shipped</Badge>;
//       case "delivered":
//         return <Badge className="bg-green-500">Delivered</Badge>;
//       case "cancelled":
//         return <Badge variant="destructive">Cancelled</Badge>;
//       default:
//         return <Badge variant="secondary">{status}</Badge>;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <Navbar />
      
//       <main className="flex-1 container mx-auto px-4 py-8">
//         <div className="max-w-2xl mx-auto">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
//             <p className="text-muted-foreground">
//               Enter your order number to check delivery status
//             </p>
//           </div>

//           <Card className="mb-8">
//             <CardContent className="pt-6">
//               <form onSubmit={handleTrackOrder} className="flex gap-3">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Enter order number (e.g., ORD-20250105-000001)"
//                     value={orderNumber}
//                     onChange={(e) => setOrderNumber(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//                 <Button type="submit" disabled={loading}>
//                   {loading ? "Tracking..." : "Track"}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>

//           {searched && !loading && order && (
//             <div className="space-y-6">
//               <Card>
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle className="text-lg">{order.order_number}</CardTitle>
//                       <CardDescription>
//                         Placed on {new Date(order.created_at).toLocaleDateString()}
//                       </CardDescription>
//                     </div>
//                     {getStatusBadge(order.status || "pending")}
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
//                     <MapPin className="h-4 w-4" />
//                     <span>
//                       Delivering to: {order.shipping_address?.full_name || "Customer"}
//                       {order.shipping_address?.city && `, ${order.shipping_address.city}`}
//                       {order.shipping_address?.country && `, ${order.shipping_address.country}`}
//                     </span>
//                   </div>
//                   <p className="font-medium">
//                     Order Total: ${order.total.toFixed(2)}
//                   </p>
//                 </CardContent>
//               </Card>

//               {order.status === "cancelled" ? (
//                 <Card className="border-destructive/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2 text-destructive">
//                       <XCircle className="h-5 w-5" />
//                       Order Cancelled
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p className="text-muted-foreground">
//                       This order has been cancelled. If you have any questions, please contact support.
//                     </p>
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Delivery Status</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-6">
//                       {timelineItems.map((item, index) => {
//                         const Icon = item.icon;
//                         const isCompleted = index < currentIndex;
//                         const isActive = index === currentIndex;

//                         return (
//                           <div key={item.status} className="relative">
//                             <div className="flex items-start gap-4">
//                               <div className={`flex-shrink-0 rounded-full p-2 ${
//                                 isCompleted ? "bg-green-500/10" : 
//                                 isActive ? "bg-primary/10" : "bg-muted"
//                               }`}>
//                                 <Icon className={`h-6 w-6 ${
//                                   isCompleted ? "text-green-500" : 
//                                   isActive ? "text-primary" : "text-muted-foreground"
//                                 }`} />
//                               </div>
//                               <div className="flex-1 pt-1">
//                                 <div className="flex items-center justify-between">
//                                   <p className={`font-semibold ${
//                                     isCompleted || isActive ? "text-foreground" : "text-muted-foreground"
//                                   }`}>
//                                     {item.label}
//                                   </p>
//                                   {isActive && (
//                                     <Badge className="bg-primary">Current</Badge>
//                                   )}
//                                   {isCompleted && (
//                                     <Badge className="bg-green-500">Completed</Badge>
//                                   )}
//                                 </div>
//                                 {item.status === "pending" && (
//                                   <p className="text-sm text-muted-foreground">
//                                     {new Date(order.created_at).toLocaleDateString()} at{" "}
//                                     {new Date(order.created_at).toLocaleTimeString([], { 
//                                       hour: '2-digit', 
//                                       minute: '2-digit' 
//                                     })}
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                             {index < timelineItems.length - 1 && (
//                               <div className={`ml-6 h-12 w-0.5 ${
//                                 isCompleted ? "bg-green-500" : "bg-border"
//                               }`} />
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>

//                     {order.status === "shipped" && (
//                       <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
//                         <p className="text-sm font-medium mb-1">Estimated Delivery</p>
//                         <p className="text-sm text-muted-foreground">
//                           {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
//                         </p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               )}
//             </div>
//           )}

//           {searched && !loading && !order && (
//             <Card className="border-amber-500/50">
//               <CardContent className="pt-6">
//                 <div className="flex items-center gap-3 text-amber-600">
//                   <AlertCircle className="h-5 w-5" />
//                   <div>
//                     <p className="font-medium">Order not found</p>
//                     <p className="text-sm text-muted-foreground">
//                       Please check your order number and try again. Order numbers typically start with "ORD-".
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           <div className="mt-8 text-center text-sm text-muted-foreground">
//             <p>Can't find your order? <a href="/contact" className="text-primary hover:underline">Contact us</a> for assistance.</p>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default TrackOrder;

import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Search, Package, Truck, CheckCircle, Clock, XCircle, AlertCircle, MapPin } from "lucide-react";
import { toast } from "sonner";

interface OrderData {
  id: string; order_number: string; status: string; created_at: string; total: number;
  shipping_address: { full_name?: string; city?: string; country?: string; };
}

const TrackOrder = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) { toast.error(t('trackOrder.enterOrderNumber')); return; }
    setLoading(true); setSearched(true);
    const { data, error } = await supabase.from("orders").select("id, order_number, status, created_at, total, shipping_address").eq("order_number", orderNumber.trim().toUpperCase()).maybeSingle();
    setLoading(false);
    if (error) { toast.error(t('trackOrder.errorTracking')); return; }
    if (data) { setOrder(data as OrderData); } else { setOrder(null); toast.error(t('trackOrder.orderNotFound')); }
  };

  const statusFlow = ["pending", "processing", "shipped", "delivered"];
  const currentIndex = order ? statusFlow.indexOf(order.status || "pending") : -1;

  const timelineItems = [
    { status: "pending", labelKey: "trackOrder.orderPlaced", icon: Clock },
    { status: "processing", labelKey: "orders.processing", icon: Package },
    { status: "shipped", labelKey: "orders.shipped", icon: Truck },
    { status: "delivered", labelKey: "orders.delivered", icon: CheckCircle },
  ];

  const getStatusBadge = (status: string) => {
    const map: Record<string, { className: string; labelKey: string }> = {
      pending: { className: "", labelKey: "orders.pending" },
      processing: { className: "bg-blue-500", labelKey: "orders.processing" },
      shipped: { className: "bg-orange-500", labelKey: "orders.shipped" },
      delivered: { className: "bg-green-500", labelKey: "orders.delivered" },
      cancelled: { className: "", labelKey: "orders.cancelled" },
    };
    const info = map[status];
    if (!info) return <Badge variant="secondary">{status}</Badge>;
    if (status === "pending") return <Badge variant="secondary">{t(info.labelKey)}</Badge>;
    if (status === "cancelled") return <Badge variant="destructive">{t(info.labelKey)}</Badge>;
    return <Badge className={info.className}>{t(info.labelKey)}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('trackOrder.title')}</h1>
            <p className="text-muted-foreground">{t('trackOrder.subtitle')}</p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleTrackOrder} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t('trackOrder.placeholder')} value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className="pl-10" />
                </div>
                <Button type="submit" disabled={loading}>{loading ? t('trackOrder.tracking') : t('trackOrder.track')}</Button>
              </form>
            </CardContent>
          </Card>

          {searched && !loading && order && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.order_number}</CardTitle>
                      <CardDescription>{t('orders.placedOn')} {new Date(order.created_at).toLocaleDateString()}</CardDescription>
                    </div>
                    {getStatusBadge(order.status || "pending")}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {t('trackOrder.deliveringTo')} {order.shipping_address?.full_name || ""}
                      {order.shipping_address?.city && `, ${order.shipping_address.city}`}
                      {order.shipping_address?.country && `, ${order.shipping_address.country}`}
                    </span>
                  </div>
                  <p className="font-medium">{t('trackOrder.orderTotal')}: {t('common.currency', { amount: order.total.toFixed(2) })}</p>
                </CardContent>
              </Card>

              {order.status === "cancelled" ? (
                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive"><XCircle className="h-5 w-5" />{t('trackOrder.orderCancelledTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent><p className="text-muted-foreground">{t('trackOrder.orderCancelledDesc')}</p></CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader><CardTitle>{t('trackOrder.deliveryStatus')}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {timelineItems.map((item, index) => {
                        const Icon = item.icon;
                        const isCompleted = index < currentIndex;
                        const isActive = index === currentIndex;
                        return (
                          <div key={item.status} className="relative">
                            <div className="flex items-start gap-4">
                              <div className={`flex-shrink-0 rounded-full p-2 ${isCompleted ? "bg-green-500/10" : isActive ? "bg-primary/10" : "bg-muted"}`}>
                                <Icon className={`h-6 w-6 ${isCompleted ? "text-green-500" : isActive ? "text-primary" : "text-muted-foreground"}`} />
                              </div>
                              <div className="flex-1 pt-1">
                                <div className="flex items-center justify-between">
                                  <p className={`font-semibold ${isCompleted || isActive ? "text-foreground" : "text-muted-foreground"}`}>{t(item.labelKey)}</p>
                                  {isActive && <Badge className="bg-primary">{t('trackOrder.current')}</Badge>}
                                  {isCompleted && <Badge className="bg-green-500">{t('trackOrder.completed')}</Badge>}
                                </div>
                                {item.status === "pending" && (
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                )}
                              </div>
                            </div>
                            {index < timelineItems.length - 1 && <div className={`ml-6 h-12 w-0.5 ${isCompleted ? "bg-green-500" : "bg-border"}`} />}
                          </div>
                        );
                      })}
                    </div>
                    {order.status === "shipped" && (
                      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-sm font-medium mb-1">{t('trackOrder.estimatedDelivery')}</p>
                        <p className="text-sm text-muted-foreground">{new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {searched && !loading && !order && (
            <Card className="border-amber-500/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{t('trackOrder.orderNotFoundTitle')}</p>
                    <p className="text-sm text-muted-foreground">{t('trackOrder.orderNotFoundDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>{t('trackOrder.cantFindOrder').replace('<1>', '<a href="/contact" class="text-primary hover:underline">').replace('</1>', '</a>')}</p>
          </div> */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackOrder;
