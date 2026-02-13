import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash, LogOut } from "lucide-react";
import { toast } from "sonner";
import { getProducts, deleteProduct } from "@/lib/api";
import { Product } from "@/lib/products-data";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Upload, X } from "lucide-react";
import { getSiteSettings, updateSiteSettings, uploadImage } from "@/lib/api";

const SiteSettingsPanel = () => {
    const [heroImages, setHeroImages] = useState<string[]>([]);
    const [marqueeText, setMarqueeText] = useState("");
    const [homeHero, setHomeHero] = useState({
        title: "",
        subtitle: "",
        description: ""
    });
    const [aboutHero, setAboutHero] = useState({
        tagline: "",
        title: "",
        titleSuffix: ""
    });
    const [logoUrl, setLogoUrl] = useState("");
    const [loadingPage, setLoadingPage] = useState({
        text: "MRL FOODS",
        imageUrl: ""
    });
    const [newsletterSection, setNewsletterSection] = useState({
        title: "",
        tagline: "",
        buttonText: ""
    });
    const [shopOurRange, setShopOurRange] = useState<{ title: string; image: string }[]>([]);
    const [trendingVideos, setTrendingVideos] = useState<string[]>([]);
    const [posters, setPosters] = useState<string[]>([]);
    const [features, setFeatures] = useState<{ icon: string; title: string; desc: string }[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await getSiteSettings();
            if (data) {
                if (data.heroImages) setHeroImages(data.heroImages);
                if (data.marqueeText) setMarqueeText(data.marqueeText);
                if (data.homeHero) setHomeHero(prev => ({ ...prev, ...data.homeHero }));
                if (data.aboutHero) setAboutHero(prev => ({ ...prev, ...data.aboutHero }));
                if (data.logoUrl) setLogoUrl(data.logoUrl);
                if (data.loadingPage) setLoadingPage(prev => ({ ...prev, ...data.loadingPage }));
                if (data.newsletterSection) setNewsletterSection(prev => ({ ...prev, ...data.newsletterSection }));
                if (data.shopOurRange) setShopOurRange(data.shopOurRange);
                if (data.trendingVideos) setTrendingVideos(data.trendingVideos);
                if (data.posters) setPosters(data.posters);
                if (data.features) setFeatures(data.features);
                if (data.brands) setBrands(data.brands);
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    };

    const heroImagesUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploading(true);

        try {
            const { image } = await uploadImage(uploadData);
            const updatedImages = [...heroImages, image];
            setHeroImages(updatedImages);
            await updateSiteSettings({ heroImages: updatedImages });
            toast.success('Hero image added successfully');
        } catch (error) {
            console.error(error);
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const deleteHeroImage = async (imageToDelete: string) => {
        const updatedImages = heroImages.filter(img => img !== imageToDelete);
        setHeroImages(updatedImages);
        try {
            await updateSiteSettings({ heroImages: updatedImages });
            toast.success('Hero image removed');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update settings');
        }
    };

    const logoUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploading(true);

        try {
            const { image } = await uploadImage(uploadData);
            setLogoUrl(image);
            await updateSiteSettings({ logoUrl: image });
            toast.success('Logo updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Logo upload failed');
        } finally {
            setUploading(false);
        }
    };

    const loadingLogoUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploading(true);

        try {
            const { image } = await uploadImage(uploadData);
            setLoadingPage(prev => ({ ...prev, imageUrl: image }));
            await updateSiteSettings({ loadingPage: { ...loadingPage, imageUrl: image } });
            toast.success('Loading logo updated');
        } catch (error) {
            console.error(error);
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const addRangeItem = () => {
        setShopOurRange([...shopOurRange, { title: "", image: "" }]);
    };

    const removeRangeItem = (index: number) => {
        const updated = [...shopOurRange];
        updated.splice(index, 1);
        setShopOurRange(updated);
    };

    const updateRangeItem = (index: number, field: 'title' | 'image', value: string) => {
        const updated = [...shopOurRange];
        updated[index] = { ...updated[index], [field]: value };
        setShopOurRange(updated);
    };

    const rangeImageUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploading(true);

        try {
            const { image } = await uploadImage(uploadData);
            updateRangeItem(index, 'image', image);
            toast.success('Range item image uploaded');
        } catch (error) {
            console.error(error);
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const videoUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file); // API expects 'image' key but supports video mime types

        setUploading(true);
        console.log('Starting video upload...', file.name, file.size);

        try {
            const { file: videoPath } = await uploadImage(uploadData);
            console.log('Upload successful:', videoPath);
            const updatedVideos = [...trendingVideos, videoPath];
            setTrendingVideos(updatedVideos);
            await updateSiteSettings({ trendingVideos: updatedVideos });
            toast.success('Trending video uploaded');
        } catch (error: any) {
            console.error('Full upload error details:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
            } else if (error.request) {
                console.error('Error request (No response):', error.request);
            } else {
                console.error('Error message:', error.message);
            }
            toast.error(`Video upload failed: ${error.message || 'Network Error'}`);
        } finally {
            setUploading(false);
        }
    };

    const deleteTrendingVideo = async (videoToDelete: string) => {
        const updatedVideos = trendingVideos.filter(v => v !== videoToDelete);
        setTrendingVideos(updatedVideos);
        try {
            await updateSiteSettings({ trendingVideos: updatedVideos });
            toast.success('Trending video removed');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update settings');
        }
    };

    const posterUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploading(true);

        try {
            const { image } = await uploadImage(uploadData);
            const updatedPosters = [...posters, image];
            setPosters(updatedPosters);
            await updateSiteSettings({ posters: updatedPosters });
            toast.success('Poster added successfully');
        } catch (error) {
            console.error(error);
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const deletePoster = async (posterToDelete: string) => {
        const updatedPosters = posters.filter(p => p !== posterToDelete);
        setPosters(updatedPosters);
        try {
            await updateSiteSettings({ posters: updatedPosters });
            toast.success('Poster removed');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update settings');
        }
    };

    const updateFeature = (index: number, field: string, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFeatures(newFeatures);
    };

    const addFeature = () => {
        if (features.length >= 3) {
            toast.error("Maximum 3 features allowed");
            return;
        }
        setFeatures([...features, { icon: "Leaf", title: "", desc: "" }]);
    };

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const brandLogoUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const data = await uploadImage(formData);
            const imageUrl = data.image || data.file;
            const updatedBrands = [...brands, imageUrl];
            setBrands(updatedBrands);
            await updateSiteSettings({ brands: updatedBrands });
            toast.success('Brand logo added');
        } catch (error) {
            console.error(error);
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const removeBrand = async (brandToRemove: string) => {
        const updatedBrands = brands.filter(b => b !== brandToRemove);
        setBrands(updatedBrands);
        try {
            await updateSiteSettings({ brands: updatedBrands });
            toast.success('Brand removed');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update settings');
        }
    };

    const handleUpdateSettings = async () => {
        setUpdating(true);
        try {
            await updateSiteSettings({
                marqueeText,
                homeHero,
                aboutHero,
                logoUrl,
                loadingPage,
                newsletterSection,
                heroImages,
                shopOurRange,
                trendingVideos,
                posters,
                features,
                brands
            });
            toast.success('Site settings updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update settings');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-card p-4 sm:p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Site Settings</h2>

            <div className="space-y-4 mb-8">
                <label className="text-sm font-medium text-foreground">Site Logo</label>
                {logoUrl && (
                    <div className="relative h-20 w-48 overflow-hidden rounded-lg border border-white/10 bg-white p-2">
                        <img src={logoUrl} alt="Logo preview" className="h-full w-full object-contain" />
                    </div>
                )}
                <div className="flex w-full sm:w-80 md:w-96 items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-background/50 px-6 py-4 transition-colors hover:bg-background/80">
                    <label htmlFor="logo-upload" className="cursor-pointer text-sm font-semibold text-gold hover:text-gold-light text-center">
                        <Upload className="mx-auto h-5 w-5 mb-1" />
                        <span>Change Site Logo</span>
                        <input id="logo-upload" type="file" className="sr-only" onChange={logoUploadHandler} accept="image/*" />
                    </label>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium text-foreground">Hero Slider Images</label>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {heroImages.map((image, index) => (
                        <div key={index} className="group relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-background">
                            <img src={image} alt={`Hero ${index + 1}`} className="h-full w-full object-cover" />
                            <button
                                onClick={() => deleteHeroImage(image)}
                                className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}

                    <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-background/50 p-4 transition-colors hover:bg-background/80">
                        <label htmlFor="hero-upload" className="flex cursor-pointer flex-col items-center gap-2 text-center text-sm font-semibold text-gold hover:text-gold-light">
                            <Upload className="h-6 w-6" />
                            <span>Add Image</span>
                            <input
                                id="hero-upload"
                                type="file"
                                className="sr-only"
                                onChange={heroImagesUploadHandler}
                                accept="image/*"
                            />
                        </label>
                    </div>
                </div>
                {uploading && <p className="text-xs text-gold">Uploading new image...</p>}
            </div>

            <div className="pt-4 space-y-4">
                <h3 className="font-bold text-lg text-gold">Home Page Hero</h3>
                <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Title</label>
                    <input
                        type="text"
                        value={homeHero.title}
                        onChange={(e) => setHomeHero({ ...homeHero, title: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-background p-3 text-sm text-foreground focus:border-gold focus:outline-none"
                        placeholder="e.g. From Soil to Soul."
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Subtitle</label>
                    <input
                        type="text"
                        value={homeHero.subtitle}
                        onChange={(e) => setHomeHero({ ...homeHero, subtitle: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-background p-3 text-sm text-foreground focus:border-gold focus:outline-none"
                        placeholder="e.g. Authentic. Unadulterated."
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Description</label>
                    <textarea
                        value={homeHero.description}
                        onChange={(e) => setHomeHero({ ...homeHero, description: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-background p-3 text-sm text-foreground focus:border-gold focus:outline-none min-h-[80px]"
                        placeholder="Hero description text..."
                    />
                </div>
            </div>

            <div className="pt-4 space-y-4 border-t border-white/10 mt-4">
                <h3 className="font-bold text-lg text-gold">About Page Hero</h3>
                <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Tagline (Top Pill)</label>
                    <input
                        type="text"
                        value={aboutHero.tagline}
                        onChange={(e) => setAboutHero({ ...aboutHero, tagline: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-background p-3 text-sm text-foreground focus:border-gold focus:outline-none"
                        placeholder="e.g. The Captain's Log"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Main Title</label>
                    <input
                        type="text"
                        value={aboutHero.title}
                        onChange={(e) => setAboutHero({ ...aboutHero, title: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-background p-3 text-sm text-foreground focus:border-gold focus:outline-none"
                        placeholder="e.g. From High Seas to"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Title Suffix (Gold Text)</label>
                    <input
                        type="text"
                        value={aboutHero.titleSuffix}
                        onChange={(e) => setAboutHero({ ...aboutHero, titleSuffix: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-background p-3 text-sm text-foreground focus:border-gold focus:outline-none"
                        placeholder="e.g. Wholesome Grains"
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-white/10 mt-4">
                <label className="text-sm font-medium text-foreground block mb-2">Marquee Text (Yellow Strap)</label>
                <p className="text-xs text-muted-foreground mb-2">Separate multiple items with a comma (,)</p>
                <textarea
                    value={marqueeText}
                    onChange={(e) => setMarqueeText(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-background p-3 text-sm text-foreground focus:border-gold focus:outline-none min-h-[100px]"
                    placeholder="Enter text for the scrolling strap..."
                />
            </div>

            {/* Loading Screen Config */}
            <div className="pt-8 border-t border-white/10 mt-8 space-y-4">
                <h3 className="font-bold text-lg text-gold">Loading Screen</h3>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-foreground">Loading Logo</label>
                    {loadingPage.imageUrl && (
                        <div className="relative h-20 w-48 overflow-hidden rounded-lg border border-white/10 bg-white p-2">
                            <img src={loadingPage.imageUrl} alt="Loading logo preview" className="h-full w-full object-contain" />
                        </div>
                    )}
                    <div className="flex w-full sm:w-80 md:w-96 items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-background/50 px-6 py-4 transition-colors hover:bg-background/80">
                        <label htmlFor="loading-logo-upload" className="cursor-pointer text-sm font-semibold text-gold hover:text-gold-light text-center">
                            <Upload className="mx-auto h-5 w-5 mb-1" />
                            <span>Change Loading Logo</span>
                            <input id="loading-logo-upload" type="file" className="sr-only" onChange={loadingLogoUploadHandler} accept="image/*" />
                        </label>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Loading Text</label>
                    <input
                        type="text"
                        value={loadingPage.text}
                        onChange={(e) => setLoadingPage({ ...loadingPage, text: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-background p-3 text-sm text-foreground focus:border-gold focus:outline-none"
                        placeholder="e.g. MRL FOODS"
                    />
                </div>

                {/* Shop Our Range Config */}
                <div className="pt-8 border-t border-white/10 mt-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-gold">Shop Our Range Carousel</h3>
                        <button
                            onClick={addRangeItem}
                            className="flex items-center gap-2 rounded-lg bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold hover:bg-gold/20 transition-all"
                        >
                            <Plus className="h-4 w-4" /> Add Range Item
                        </button>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {shopOurRange.map((item, index) => (
                            <div key={index} className="relative rounded-xl border border-white/10 bg-background/50 p-4 space-y-4 group">
                                <button
                                    onClick={() => removeRangeItem(index)}
                                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg transition-transform hover:scale-110 z-10"
                                >
                                    <X className="h-4 w-4" />
                                </button>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Item Title</label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => updateRangeItem(index, 'title', e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-background p-2 text-sm text-foreground focus:border-gold focus:outline-none"
                                        placeholder="e.g. Noodles"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Item Image</label>
                                    {item.image ? (
                                        <div className="relative aspect-square overflow-hidden rounded-lg border border-white/5">
                                            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <label className="cursor-pointer rounded-full bg-white/10 backdrop-blur-md p-2 text-white hover:bg-white/20 transition-all">
                                                    <Upload className="h-5 w-5" />
                                                    <input
                                                        type="file"
                                                        className="sr-only"
                                                        onChange={(e) => rangeImageUploadHandler(e, index)}
                                                        accept="image/*"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-background transition-colors hover:bg-background/80">
                                            <label className="cursor-pointer flex flex-col items-center gap-2 text-sm font-semibold text-gold">
                                                <Upload className="h-6 w-6" />
                                                <span>Upload</span>
                                                <input
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={(e) => rangeImageUploadHandler(e, index)}
                                                    accept="image/*"
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {shopOurRange.length === 0 && (
                        <div className="text-center py-12 rounded-xl border border-dashed border-white/10">
                            <p className="text-muted-foreground italic">No range items added yet. Click "Add Range Item" to start.</p>
                        </div>
                    )}
                </div>

                {/* Trending Videos Config */}
                <div className="pt-8 border-t border-white/10 mt-8 space-y-6">
                    <h3 className="font-bold text-lg text-gold">What's Trending Videos</h3>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {trendingVideos.map((video, index) => (
                            <div key={index} className="group relative aspect-[9/16] overflow-hidden rounded-lg border border-white/10 bg-background">
                                <video src={video} className="h-full w-full object-cover" muted loop playsInline />
                                <button
                                    onClick={() => deleteTrendingVideo(video)}
                                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500 shadow-lg"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}

                        <div className="flex aspect-[9/16] items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-background/50 p-4 transition-colors hover:bg-background/80">
                            <label className="flex cursor-pointer flex-col items-center gap-2 text-center text-sm font-semibold text-gold hover:text-gold-light">
                                <Upload className="h-6 w-6" />
                                <span>Add Video</span>
                                <input
                                    type="file"
                                    className="sr-only"
                                    onChange={videoUploadHandler}
                                    accept="video/*"
                                />
                            </label>
                        </div>
                    </div>
                    {uploading && <p className="text-xs text-gold">Uploading...</p>}
                </div>

                {/* Posters Config */}
                <div className="pt-8 border-t border-white/10 mt-8 space-y-6">
                    <h3 className="font-bold text-lg text-gold">Promotional Posters</h3>
                    <p className="text-xs text-muted-foreground">These will appear as a full-width section after the Trending Videos.</p>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {posters.map((poster, index) => (
                            <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-background">
                                <img src={poster} alt={`Poster ${index + 1}`} className="h-full w-full object-cover" />
                                <button
                                    onClick={() => deletePoster(poster)}
                                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500 shadow-lg"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}

                        <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-background/50 p-4 transition-colors hover:bg-background/80">
                            <label className="flex cursor-pointer flex-col items-center gap-2 text-center text-sm font-semibold text-gold hover:text-gold-light">
                                <Upload className="h-6 w-6" />
                                <span>Add Poster</span>
                                <input
                                    type="file"
                                    className="sr-only"
                                    onChange={posterUploadHandler}
                                    accept="image/*"
                                />
                            </label>
                        </div>
                    </div>
                    {uploading && <p className="text-xs text-gold">Uploading...</p>}
                </div>

                {/* Features Section Config */}
                <div className="pt-8 border-t border-white/10 mt-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-gold">Features Section</h3>
                        <button
                            onClick={addFeature}
                            className="flex items-center gap-2 rounded-lg bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold hover:bg-gold/20 transition-all"
                        >
                            <Plus className="h-4 w-4" /> Add Feature
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Manage the 100% Natural, Free Shipping, etc. section.</p>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div key={index} className="relative rounded-xl border border-white/10 bg-background/50 p-4 space-y-4 group">
                                <button
                                    onClick={() => removeFeature(index)}
                                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg transition-transform hover:scale-110 z-10"
                                >
                                    <X className="h-4 w-4" />
                                </button>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Icon (Leaf, Truck, Shield)</label>
                                    <select
                                        value={feature.icon}
                                        onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-background p-2 text-sm text-foreground focus:border-gold focus:outline-none"
                                    >
                                        <option value="Leaf">Leaf (Natural)</option>
                                        <option value="Truck">Truck (Shipping)</option>
                                        <option value="Shield">Shield (Secure)</option>
                                        <option value="Star">Star (Quality)</option>
                                        <option value="Heart">Heart (Love)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</label>
                                    <input
                                        type="text"
                                        value={feature.title}
                                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-background p-2 text-sm text-foreground focus:border-gold focus:outline-none"
                                        placeholder="e.g. 100% Natural"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
                                    <input
                                        type="text"
                                        value={feature.desc}
                                        onChange={(e) => updateFeature(index, 'desc', e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-background p-2 text-sm text-foreground focus:border-gold focus:outline-none"
                                        placeholder="e.g. Pure, preservative-free goodness."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {features.length === 0 && (
                        <div className="text-center py-12 rounded-xl border border-dashed border-white/10">
                            <p className="text-muted-foreground italic">No features added. Click "Add Feature" to start.</p>
                        </div>
                    )}
                </div>

                {/* Brands Section Config */}
                <div className="pt-8 border-t border-white/10 mt-8 space-y-6">
                    <h3 className="font-bold text-lg text-gold">Trusted Brand Logos</h3>
                    <p className="text-xs text-muted-foreground">Upload brand logo images (PNG with transparent background recommended).</p>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {brands.map((brand, index) => (
                            <div key={index} className="group relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-white/5 p-4 flex items-center justify-center">
                                <img src={brand} alt={`Brand ${index + 1}`} className="max-h-full max-w-full object-contain filter grayscale invert opacity-50 group-hover:opacity-100 group-hover:grayscale-0 group-hover:invert-0 transition-all" />
                                <button
                                    onClick={() => removeBrand(brand)}
                                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500 shadow-lg"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}

                        {/* Upload button */}
                        <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-background/50 p-2 transition-colors hover:bg-background/80">
                            <label className="flex cursor-pointer flex-col items-center gap-1 text-center text-[10px] font-semibold text-gold hover:text-gold-light">
                                <Upload className="h-4 w-4" />
                                <span>Add Logo</span>
                                <input
                                    type="file"
                                    className="sr-only"
                                    onChange={brandLogoUploadHandler}
                                    accept="image/*"
                                />
                            </label>
                        </div>
                    </div>

                    {uploading && <p className="text-xs text-gold">Uploading...</p>}
                </div>

                <div className="pt-6">
                    <MagneticButton>
                        <button
                            onClick={handleUpdateSettings}
                            disabled={updating}
                            className="rounded-full bg-gold px-8 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-gold-light disabled:opacity-50 shadow-lg shadow-gold/20"
                        >
                            {updating ? 'Saving...' : 'Save All Settings'}
                        </button>
                    </MagneticButton>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await deleteProduct(id);
            toast.success("Product deleted successfully");
            fetchProducts();
        } catch (error) {
            console.error("Failed to delete product", error);
            toast.error("Failed to delete product");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="font-display text-2xl sm:text-4xl font-bold text-foreground">Admin Dashboard</h1>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <Link to="/admin/products/new">
                            <MagneticButton>
                                <button className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-gold-light whitespace-nowrap">
                                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" /> Add Product
                                </button>
                            </MagneticButton>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-full border border-white/10 bg-card px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground transition-all hover:bg-white/10 whitespace-nowrap"
                        >
                            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" /> Logout
                        </button>
                    </div>
                </div>

                <div className="grid gap-8 mb-8">
                    <SiteSettingsPanel />
                </div>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Products</h2>

                {/* Desktop Table View */}
                <div className="hidden md:block rounded-2xl border border-white/10 bg-card overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((product) => (
                                <tr key={product._id || product.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <img src={product.image} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-foreground">{product.name}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                                    <td className="px-6 py-4 text-foreground">₹{product.price}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/admin/products/edit/${product._id || product.id}`}>
                                                <button className="rounded-lg bg-blue-500/10 p-2 text-blue-500 hover:bg-blue-500/20 transition-colors">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id || product.id || '')}
                                                className="rounded-lg bg-red-500/10 p-2 text-red-500 hover:bg-red-500/20 transition-colors"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {products.map((product) => (
                        <div key={product._id || product.id} className="rounded-2xl border border-white/10 bg-card p-4 flex gap-4">
                            <img src={product.image} alt={product.name} className="h-20 w-20 rounded-xl object-cover shrink-0" />
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-foreground text-sm line-clamp-1">{product.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                                    <p className="text-gold font-bold text-sm mt-1">₹{product.price}</p>
                                </div>
                                <div className="flex justify-end gap-2 mt-2">
                                    <Link to={`/admin/products/edit/${product._id || product.id}`}>
                                        <button className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product._id || product.id || '')}
                                        className="rounded-lg bg-red-500/10 p-2 text-red-500"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
