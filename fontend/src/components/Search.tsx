import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { products } from "@/lib/products-data";

export function Search({ isScrolled, isDarkPath }: { isScrolled: boolean, isDarkPath: boolean }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    const isDarkText = isScrolled || !isDarkPath;

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={`group rounded-full p-2.5 transition-colors hover:bg-secondary/50 ${isDarkText ? "text-foreground" : "text-white"
                    }`}
            >
                <SearchIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="sr-only">Search products</span>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search products..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Products">
                        {products.map((product) => (
                            <CommandItem
                                key={product.id}
                                value={product.name}
                                onSelect={() => {
                                    runCommand(() => navigate(`/products/${product.id}`));
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-md bg-secondary/20 overflow-hidden">
                                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                    </div>
                                    <span>{product.name}</span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
