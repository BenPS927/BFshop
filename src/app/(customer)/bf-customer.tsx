'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AddIcon from '@mui/icons-material/Add';


type Product = {
    thumbnail?: string
    name?: string
    title?: string
    price?: number
    id: string
   
}

type CartItem = {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  amount: number;
};

const CART_STORAGE_KEY = 'selection';



export default function BFCustomerPage(){

    const [products, setProducts] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktopCartOpen, setIsDesktopCartOpen] = useState(false);
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const [activeMobileProductId, setActiveMobileProductId] = useState<string | null>(null)

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.amount, 0);

    function formatPrice(value: number) {
        return `$${value.toFixed(2)}`;
    }

    function updateCart(mutator: (prevCartItems: CartItem[]) => CartItem[]) {
        setCartItems((prevCartItems) => {
            const updatedCart = mutator(prevCartItems);
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
            return updatedCart;
        });
    }

    function handleCartItemAmountChange(itemIndex: number, change: number) {
        updateCart((prevCartItems) => {
            const nextCart = prevCartItems.flatMap((item, index) => {
                if (index !== itemIndex) {
                    return [item];
                }

                const nextAmount = item.amount + change;
                if (nextAmount <= 0) {
                    return [];
                }

                return [{ ...item, amount: nextAmount }];
            });

            return nextCart;
        });
    }


    function handleSubmit(e: React.FormEvent, product: Product) {
  e.preventDefault(); // stop default form submission (no page reload)

    const amount = quantities[product.id] ?? 0;
    if (amount <= 0) {
        console.warn('[cart debug] add blocked because amount is 0', {
            productId: product.id,
            amount,
            quantitiesSnapshot: quantities,
        });
        return;
    }

  const newItem = {
    id: product.id, // take product id
    title: product.title ?? product.name ?? "Untitled", // choose best available name
    price: product.price ?? 0, // unit price (fallback 0)
    thumbnail: product.thumbnail ?? "/bg3.jpg", // product image or placeholder
        amount, // quantity for this product id
  };

    updateCart((prevCartItems) => {
        const existingItemIndex = prevCartItems.findIndex((item) => item.id === newItem.id);

        let updatedCart: CartItem[];
        if (existingItemIndex >= 0) {
            updatedCart = prevCartItems.map((item, index) => {
                if (index !== existingItemIndex) {
                    return item;
                }

                return {
                    ...item,
                    amount: item.amount + newItem.amount,
                };
            });
        } else {
            updatedCart = [...prevCartItems, newItem];
        }

        console.group('[cart debug] cumulative cart + localStorage');
        console.log('previous React state (cartItems):', prevCartItems);
        console.log('incoming newItem:', newItem);
        console.log('merged existing item:', existingItemIndex >= 0);
        console.log('next React state (updatedCart):', updatedCart);
        console.log('cumulative count:', updatedCart.length);
        console.table(updatedCart);
        console.groupEnd();

        return updatedCart;
    }); // Make a new array that contains all the old cart items, plus this new item.

        setQuantities((prev) => ({ ...prev, [product.id]: 0 }));

  console.log(newItem); // debug: log the item being added
}

    useEffect(() => {
        const savedCartRaw = localStorage.getItem(CART_STORAGE_KEY);
        if (!savedCartRaw) {
            return;
        }

        try {
            const savedCart = JSON.parse(savedCartRaw) as CartItem[];
            if (Array.isArray(savedCart)) {
                setCartItems(savedCart);
                console.log('[cart debug] hydrated from localStorage:', savedCart);
            }
        } catch {
            console.warn('[cart debug] failed to parse cart from localStorage');
        }
    }, []);

    

    useEffect(() => { //useffect's job is to run side effects that happen outside of normal rendering processes
        async function loadProducts() { //async allows the function to use await. loadProducts decalres a new function
            setIsLoading(true)
            const response = await fetch("/api/products") //this variable will hold the server response. await means the function pauses until the request finishes
                                                            // fetch makes the request
            const data = await response.json()      //this creates a variable that will hold the parsed result. await makes it pause until the conversion finishes
                                                    //.json takes the response body and converts it into JS data
            setProducts(data.products)          //here data variable is stored in setProducts, so therefor updates the products array
            setIsLoading(false)
            }
 
            loadProducts()
        }, [])

    return (
        <div className="relative min-h-screen bg-neutral-100 flex flex-col items-center px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">
            <Link href="/" className="absolute top-4 left-4 font-inter text-sm text-gray-500 hover:text-neutral-950 transition">&larr; Back</Link>
            <div className="w-full max-w-full flex flex-col justify-center items-center p-8 lg:p-16 space-y-16">
                <h1 className="font-bebas text-4xl tracking-wide leading-tight text-center p-2 lg:p-8 border-b border-orange-500 md:text-5xl lg:text-6xl">BF <span className="text-[orange]">Customer</span></h1>
                    <h2 className="font-inter text-base leading-relaxed text-gray-600 text-left md:text-center lg:text-center p-2 lg:p-8 md:text-lg">This is BF Customer, the customer end of BFShop. Here, you will be able to place 
                        orders which will appear in BF Merchant, which you can get to by going back and to the Merchant interface (when it's built).
                    </h2>
                
            </div>
            <div className="hidden md:hidden lg:block">
            <div
                onMouseEnter={() => setIsDesktopCartOpen(true)}
                onMouseLeave={() => setIsDesktopCartOpen(false)}
                className={`flex fixed right-0 top-20 z-[100] bg-neutral-100 text-neutral-900 border border-neutral-300 shadow-lg transition-transform duration-300 max-h-[calc(100vh-6rem)] overflow-hidden ${isDesktopCartOpen ? "translate-x-0" : "translate-x-4/5"}`}
                style={{ colorScheme: 'light' }}
            >
                <div className=" w-1/5 p-4 flex items-center justify-center p-8">
                    <ShoppingBasketIcon sx={{ 
                        color: "orange",
                        fontSize: 32
                     }}/>
                </div>
                <div className=" w-4/5 p-4 flex flex-col items-center p-8 gap-2 flex-1 min-h-0 overflow-y-auto overflow-x-hidden text-neutral-900" style={{ direction: 'rtl' }}>
                    <div className="w-full" style={{ direction: 'ltr' }}>
                        <div className="mb-2 border border-neutral-300 rounded bg-white p-2">
                            <p className="font-inter text-xs text-gray-600">Cart total</p>
                            <p className="font-inter text-base font-semibold text-neutral-950">{formatPrice(cartTotal)}</p>
                        </div>
                        {cartItems.length === 0 ? (
                            <p className="font-inter text-sm text-gray-500">Cart is empty</p>
                        ) : (
                            cartItems.map((cartItem, index) => (
                                <div key={`${cartItem.id}-${index}`} className="w-full border border-neutral-300 rounded bg-white p-2 text-neutral-900">
                                    <p className="font-inter text-sm font-semibold text-neutral-900">{cartItem.title}</p>
                                    <img src={cartItem.thumbnail} alt={cartItem.title} className="w-full h-16 object-cover rounded" />
                                    <div className="mt-2 flex items-center justify-between">
                                        <p className="font-inter text-xs text-neutral-800">Qty: {cartItem.amount}</p>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                className="px-2 py-1 text-xs border border-neutral-300 rounded bg-white text-neutral-900 hover:bg-neutral-100"
                                                onClick={() => handleCartItemAmountChange(index, -1)}
                                            >
                                                -
                                            </button>
                                            <button
                                                type="button"
                                                className="px-2 py-1 text-xs border border-neutral-300 rounded bg-white text-neutral-900 hover:bg-neutral-100"
                                                onClick={() => handleCartItemAmountChange(index, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <p className="font-inter text-xs text-neutral-800">Unit price: {formatPrice(cartItem.price)}</p>
                                    <p className="font-inter text-xs font-semibold text-neutral-900">Item total: {formatPrice(cartItem.price * cartItem.amount)}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                </div>
            </div>
            <div
                className={`flex lg:hidden fixed right-0 top-20 z-[100] bg-neutral-100 text-neutral-900 border border-neutral-300 shadow-lg rounded-md ${isOpen ? "translate-x-0" : "translate-x-4/5"} transition-transform duration-300 max-h-[calc(100vh-6rem)] overflow-hidden`}
                style={{ colorScheme: 'light' }}>
                <div
                    className=" w-1/5 p-4 flex items-center justify-center p-8 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <ShoppingBasketIcon sx={{ 
                        color: "orange",
                        fontSize: 32
                     }}/>
                </div>
                <div className=" w-4/5 p-4 flex flex-col items-center p-8 gap-2 flex-1 min-h-0 overflow-y-auto overflow-x-hidden text-neutral-900" style={{ direction: 'rtl' }}>
                    <div className="w-full" style={{ direction: 'ltr' }}>
                        <div className="mb-2 border border-neutral-300 rounded bg-white p-2">
                            <p className="font-inter text-xs text-gray-600">Cart total</p>
                            <p className="font-inter text-base font-semibold text-neutral-950">{formatPrice(cartTotal)}</p>
                        </div>
                        {cartItems.length === 0 ? (
                            <p className="font-inter text-sm text-gray-500">Cart is empty</p>
                        ) : (
                            cartItems.map((cartItem, index) => (
                                <div key={`${cartItem.id}-${index}`} className="w-full border border-neutral-300 rounded bg-white p-2 text-neutral-900">
                                    <p className="font-inter text-sm font-semibold text-neutral-900">{cartItem.title}</p>
                                    <img src={cartItem.thumbnail} alt={cartItem.title} className="w-full h-16 object-cover rounded" />
                                    <div className="mt-2 flex items-center justify-between">
                                        <p className="font-inter text-xs text-neutral-800">Qty: {cartItem.amount}</p>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                className="px-2 py-1 text-xs border border-neutral-300 rounded bg-white text-neutral-900 hover:bg-neutral-100"
                                                onClick={() => handleCartItemAmountChange(index, -1)}
                                            >
                                                -
                                            </button>
                                            <button
                                                type="button"
                                                className="px-2 py-1 text-xs border border-neutral-300 rounded bg-white text-neutral-900 hover:bg-neutral-100"
                                                onClick={() => handleCartItemAmountChange(index, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <p className="font-inter text-xs text-neutral-800">Unit price: {formatPrice(cartItem.price)}</p>
                                    <p className="font-inter text-xs font-semibold text-neutral-900">Item total: {formatPrice(cartItem.price * cartItem.amount)}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <p className="font-inter text-2xl font-semibold text-neutral-950">Have a browse!</p>
            {isLoading ? (
                <p className="font-inter text-lg text-gray-500">Products loading...</p>
            ) : (
            <div className="w-full max-w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {products.map((product, index) => (
                <div className=" group" key={index}>
                    <div className={`relative  flex flex-col justify-center items-center h-48 md:h-48 lg:h-64 transition-transform duration-300 lg:group-hover:-translate-x-12 ${activeMobileProductId === product.id ? "-translate-x-12" : ""}`}>
                        <div
                            className="absolute flex flex-col items-center justify-center h-2/3 w-2/3 z-20 text-sm md:text-lg lg:text-lg cursor-pointer lg:cursor-default"
                            onClick={() => {
                                if (window.matchMedia('(max-width: 1023px)').matches) {
                                    setActiveMobileProductId((prev) => (prev === product.id ? null : product.id));
                                }
                            }}
                        >
                            <img src ={product.thumbnail ?? "/bg3.jpg"} alt="Item Image" />
                            <p className="font-inter text-neutral-900">{product.title ?? "Item Name"}</p>
                            <p className="block lg:hidden font-inter text-neutral-900"> {product.price}</p>
                            
                        </div>
                    <div
                        className={`flex flex-col absolute z-10 transition-all duration-300 w-2/3 lg:w-1/3 space-y-2 ${activeMobileProductId === product.id ? "translate-x-38 opacity-100 pointer-events-auto" : "translate-x-0 opacity-0 pointer-events-none"} lg:translate-x-0 lg:opacity-0 lg:pointer-events-none lg:group-hover:translate-x-38 lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto`}
                        onClick={(e) => e.stopPropagation()}
                    >
                       
                        <p className="font-inter text-sm text-neutral-900">{product.price}</p>
                        <p className="font-inter text-sm text-neutral-800">Select quantity</p>
                        <div>
                            <form 
                                onSubmit={(e) => handleSubmit(e, product)}
                                id="expense-form">
                                <input 
                                    className="block lg:inline-block w-12 lg:w-14 shadow-lg bg-white text-neutral-900 border border-neutral-300 rounded px-2 py-1"
                                    type="number"
                                    style={{ colorScheme: 'light' }}
                                                                        min={0}
                                                                        value={(quantities[product.id] ?? 0) === 0 ? '' : quantities[product.id]}
                                                                        onChange={e => {
                                                                            const next = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value) || 0)
                                                                            setQuantities((prev) => ({ ...prev, [product.id]: next }))
                                                                        }}
        
                                />
                          
                                   
                       
                        
                        <button
                            type="submit"
                            className="block lg:inline-block mt-2 lg:mt-0 cursor-pointer transition-transform hover:scale-120 p-0 m-0 appearance-none"
                            style={{ border: "none", background: "none" }}
                            >
                        <AddIcon  sx={{ 
                                    color: "orange",
                                    fontSize: 64
                                    }}/>
                        </button>
                        </form>
                    </div>
                </div>
                </div>
                </div>
                ))}
                
            </div>
            )}
        </div>
            
            )
    }