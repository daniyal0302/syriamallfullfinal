import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  redirect_url: string | null;
  is_active: boolean;
  display_order: number;
}

export default function AdminBanners() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    redirect_url: "",
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error: any) {
      console.error("Error fetching banners:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load banners",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.image_url) {
      toast({
        title: "Error",
        description: "Title and image are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (editingBanner) {
        const { error } = await supabase
          .from("banners")
          .update(formData)
          .eq("id", editingBanner.id);

        if (error) throw error;
        toast({ title: "Success", description: "Banner updated successfully" });
      } else {
        const { error } = await supabase.from("banners").insert(formData);

        if (error) throw error;
        toast({ title: "Success", description: "Banner created successfully" });
      }

      setShowDialog(false);
      resetForm();
      fetchBanners();
    } catch (error: any) {
      console.error("Error saving banner:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save banner",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const { error } = await supabase.from("banners").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Banner deleted successfully" });
      fetchBanners();
    } catch (error: any) {
      console.error("Error deleting banner:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("banners")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Banner status updated" });
      fetchBanners();
    } catch (error: any) {
      console.error("Error updating banner:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update banner",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      image_url: "",
      redirect_url: "",
      is_active: true,
      display_order: 0,
    });
    setEditingBanner(null);
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      image_url: banner.image_url,
      redirect_url: banner.redirect_url || "",
      is_active: banner.is_active,
      display_order: banner.display_order,
    });
    setShowDialog(true);
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
          <h1 className="text-3xl font-heading font-bold">Banner Management</h1>
          <p className="text-muted-foreground">Manage homepage banners and sliders</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Banners</CardTitle>
        </CardHeader>
        <CardContent>
          {banners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No banners found. Create your first banner!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Redirect URL</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      {banner.image_url ? (
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="h-12 w-20 object-cover rounded"
                        />
                      ) : (
                        <div className="h-12 w-20 bg-muted rounded flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{banner.title}</p>
                        {banner.subtitle && (
                          <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {banner.redirect_url || "-"}
                    </TableCell>
                    <TableCell>{banner.display_order}</TableCell>
                    <TableCell>
                      {banner.is_active ? (
                        <Badge className="bg-green-600">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(banner.id, banner.is_active)}
                        >
                          {banner.is_active ? "Disable" : "Enable"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(banner)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(banner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
            <DialogTitle>{editingBanner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
            <DialogDescription>
              {editingBanner ? "Update banner details" : "Create a new homepage banner"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Banner title..."
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Banner subtitle..."
              />
            </div>

            <ImageUploader
              label="Banner Image *"
              bucket="vendor-banners"
              currentImageUrl={formData.image_url}
              onUpload={(url) => setFormData({ ...formData, image_url: url })}
              onRemove={() => setFormData({ ...formData, image_url: "" })}
              maxSizeMB={2}
            />

            <div>
              <Label>Redirect URL</Label>
              <Input
                value={formData.redirect_url}
                onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })}
                placeholder="/category/electronics or https://..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Where users go when clicking the banner
              </p>
            </div>
            <div>
              <Label>Display Order</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                `${editingBanner ? "Update" : "Create"} Banner`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
