import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, Loader2, Send, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
  vendor_id: string;
  vendor?: { store_name: string };
}

const statusColors: Record<string, string> = {
  open: "bg-yellow-500",
  in_progress: "bg-blue-500",
  resolved: "bg-green-500",
  closed: "bg-muted",
};

const priorityColors: Record<string, string> = {
  low: "bg-muted",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

export default function AdminSupportTickets() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*, vendor:vendors(store_name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets((data as any) || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const openTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setReply(ticket.admin_response || "");
    setNewStatus(ticket.status);
    setDialogOpen(true);
  };

  const handleReply = async () => {
    if (!selectedTicket) return;
    setSubmitting(true);
    try {
      const updates: any = { status: newStatus };
      if (reply.trim()) updates.admin_response = reply.trim();

      const { error } = await supabase
        .from("support_tickets")
        .update(updates)
        .eq("id", selectedTicket.id);

      if (error) throw error;

      // Notify the vendor
      await supabase.from("notifications").insert({
        user_id: null, // We don't have vendor user_id easily; vendor checks tickets directly
        title: "Support Ticket Updated",
        message: `Your ticket "${selectedTicket.subject}" has been updated to ${newStatus}.`,
        type: "support",
      });

      toast({ title: "Ticket Updated", description: "Your reply has been saved." });
      setDialogOpen(false);
      fetchTickets();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const unreadCount = tickets.filter((t) => t.status === "open").length;

  const filtered = filterStatus === "all" ? tickets : tickets.filter((t) => t.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground">
            Manage vendor support requests
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">{unreadCount} open</Badge>
            )}
          </p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tickets</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tickets ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tickets found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1 flex-1">
                    <p className="font-bold">{ticket.subject}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{(ticket as any).vendor?.store_name || "Unknown Vendor"}</span>
                      <Clock className="h-3 w-3 ml-2" />
                      <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={statusColors[ticket.status] || "bg-muted"}>
                        {ticket.status?.replace("_", " ")}
                      </Badge>
                      <Badge className={priorityColors[ticket.priority] || "bg-muted"}>
                        {ticket.priority}
                      </Badge>
                      {!ticket.admin_response && (
                        <Badge variant="destructive">Needs Reply</Badge>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => openTicket(ticket)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    View & Reply
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ticket Detail + Reply Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4 mt-2">
              <div>
                <Label className="text-muted-foreground text-xs">Subject</Label>
                <p className="font-medium">{selectedTicket.subject}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Vendor</Label>
                <p className="text-sm">{(selectedTicket as any).vendor?.store_name || "Unknown"}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Priority</Label>
                  <Badge className={priorityColors[selectedTicket.priority]}>{selectedTicket.priority}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Created</Label>
                  <p className="text-sm">{new Date(selectedTicket.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Vendor Message</Label>
                <div className="bg-muted p-3 rounded-lg mt-1">
                  <p className="text-sm whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Admin Reply</Label>
                <Textarea
                  rows={4}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply to the vendor..."
                />
              </div>

              <Button onClick={handleReply} disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Save & Reply
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
