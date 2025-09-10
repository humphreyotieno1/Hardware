"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { adminApi, AdminProduct, CreateProductRequest, UpdateProductRequest, Category } from "@/lib/api/admin"
import { uploadApi, UploadedFile } from "@/lib/api/upload"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/ui/image-upload"
import { Loader2, Plus, Edit } from "lucide-react"

interface ProductFormDialogProps {
  product?: AdminProduct | null
  onSuccess: () => void
  trigger?: React.ReactNode
}

export function ProductFormDialog({ product, onSuccess, trigger }: ProductFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([])
  const [formData, setFormData] = useState<CreateProductRequest>({
    sku: "",
    name: "",
    slug: "",
    category_id: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    images_json: [],
    is_active: true,
    is_featured: false
  })
  const { toast } = useToast()

  const isEdit = !!product

  useEffect(() => {
    if (open) {
      loadCategories()
      if (product) {
        setFormData({
          sku: product.sku,
          name: product.name,
          slug: product.slug,
          category_id: product.category_id,
          description: product.description,
          price: product.price,
          stock_quantity: product.stock_quantity,
          images_json: product.images_json || [],
          is_active: product.is_active,
          is_featured: product.is_featured || false
        })
        
        // Convert existing image URLs to UploadedFile format for editing
        const existingImages: UploadedFile[] = (product.images_json || []).map((url, index) => ({
          public_id: `existing-${index}`,
          url: url,
          secure_url: url,
          format: 'jpg',
          width: 0,
          height: 0,
          bytes: 0,
          filename: `existing-image-${index + 1}.jpg`,
          size: 0
        }))
        setUploadedImages(existingImages)
      } else {
        setFormData({
          sku: "",
          name: "",
          slug: "",
          category_id: "",
          description: "",
          price: 0,
          stock_quantity: 0,
          images_json: [],
          is_active: true,
          is_featured: false
        })
        setUploadedImages([])
      }
    }
  }, [open, product])

  const loadCategories = async () => {
    try {
      const categoriesData = await adminApi.getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleImagesChange = (images: UploadedFile[]) => {
    setUploadedImages(images)
    // Update formData with image URLs
    const imageUrls = images.map(img => img.secure_url)
    setFormData(prev => ({
      ...prev,
      images_json: imageUrls
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.sku || !formData.category_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      if (isEdit && product) {
        const updateData: UpdateProductRequest = {
          name: formData.name,
          slug: formData.slug,
          category_id: formData.category_id,
          description: formData.description,
          price: formData.price,
          stock_quantity: formData.stock_quantity,
          images_json: formData.images_json,
          is_active: formData.is_active,
          is_featured: formData.is_featured
        }
        await adminApi.updateProduct(product.ID, updateData)
        toast({
          title: "Success",
          description: "Product updated successfully",
        })
      } else {
        await adminApi.createProduct(formData)
        toast({
          title: "Success",
          description: "Product created successfully",
        })
      }
      
      setOpen(false)
      onSuccess()
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="Enter SKU"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="product-slug"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.ID} value={category.ID}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (KES)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
          </div>

          <ImageUpload
            images={uploadedImages}
            onImagesChange={handleImagesChange}
            folder="products"
            maxFiles={5}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active Product</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
              />
              <Label htmlFor="is_featured">Featured Product</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
