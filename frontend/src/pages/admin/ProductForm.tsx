import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { createProduct, getProductById, updateProduct, uploadImage } from "@/lib/api";
import { categories, Product } from "@/lib/products-data";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowLeft, Upload, X } from "lucide-react";

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const isEdit = !!id;

    const [formData, setFormData] = useState<Partial<Product>>({
        name: "",
        description: "",
        price: 0,
        originalPrice: 0,
        image: "",
        category: "", // Allow empty initially
        weight: "",
        badge: "",
    });

    const [availableCategories, setAvailableCategories] = useState<string[]>(categories.filter(c => c !== "All"));

    useEffect(() => {
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const data = await getProductById(id as string);
            setFormData(data);
        } catch (error) {
            console.error("Failed to fetch product", error);
            toast.error("Failed to load product details");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" || name === "originalPrice" ? Number(value) : value,
        }));
    };

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploading(true);

        try {
            const { image } = await uploadImage(uploadData);
            setFormData((prev) => ({ ...prev, image }));
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error(error);
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                await updateProduct(id as string, formData);
                toast.success("Product updated successfully");
            } else {
                await createProduct(formData as Omit<Product, "id">);
                toast.success("Product created successfully");
            }
            navigate("/admin/dashboard");
        } catch (error) {
            console.error("Failed to save product", error);
            toast.error("Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="mx-auto max-w-3xl">
                <Link to="/admin/dashboard" className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>

                <div className="rounded-2xl border border-white/10 bg-card p-5 sm:p-8 shadow-xl">
                    <h1 className="mb-6 sm:mb-8 font-display text-2xl sm:text-3xl font-bold text-foreground">
                        {isEdit ? "Edit Product" : "Add New Product"}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-white/10 bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-gold/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Category</label>
                                <input
                                    list="categories-list"
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    placeholder="Select or type new category"
                                    className="w-full rounded-lg border border-white/10 bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-gold/50"
                                />
                                <datalist id="categories-list">
                                    {availableCategories.map((cat) => (
                                        <option key={cat} value={cat} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full rounded-lg border border-white/10 bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-gold/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Original Price (₹)</label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full rounded-lg border border-white/10 bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-gold/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-foreground">Product Image</label>

                            {formData.image && (
                                <div className="relative h-48 w-full overflow-hidden rounded-lg border border-white/10 bg-background md:w-48">
                                    <img src={formData.image} alt="Product preview" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                        className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            <div className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-background/50 px-6 py-10 transition-colors hover:bg-background/80">
                                <div className="text-center">
                                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md font-semibold text-gold focus-within:outline-none focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2 hover:text-gold-light"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                onChange={uploadFileHandler}
                                                accept="image/*"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
                                </div>
                            </div>
                            {uploading && <p className="text-sm text-gold">Uploading...</p>}

                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="hidden"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full rounded-lg border border-white/10 bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-gold/50"
                            />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Weight</label>
                                <input
                                    type="text"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. 500g"
                                    className="w-full rounded-lg border border-white/10 bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-gold/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Badge (Optional)</label>
                                <input
                                    type="text"
                                    name="badge"
                                    value={formData.badge}
                                    onChange={handleChange}
                                    placeholder="e.g. Bestseller, New"
                                    className="w-full rounded-lg border border-white/10 bg-background px-4 py-3 text-foreground outline-none transition-colors focus:border-gold/50"
                                />
                            </div>
                        </div>

                        <MagneticButton>
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="w-full rounded-full bg-gold py-4 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-gold-light disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save Product"}
                            </button>
                        </MagneticButton>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
