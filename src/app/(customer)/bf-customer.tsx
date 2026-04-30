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

type Selection = {
  id: string
  title: string
  price: number
  amount: number
  thumbnail?: string
}

type CartItem = {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  amount: number;
};



export default function BFCustomerPage(){

    const [products, setProducts] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selection, setSelection] = useState(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true)


    //handles the form submission from selecting products
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        localStorage.setItem("selection", JSON.stringify(cartItems))
        const saved = localStorage.getItem("selection");
        setCartItems(saved ? JSON.parse(saved) : []);
        console.log(cartItems)
    }

    

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
            <div className=" min-w-screen flex flex-col justify-center items-center p-8 lg:p-16 space-y-16">
                <h1 className="font-bebas text-4xl tracking-wide leading-tight text-center p-2 lg:p-8 border-b border-orange-500 md:text-5xl lg:text-6xl">BF <span className="text-[orange]">Customer</span></h1>
                    <h2 className="font-inter text-base leading-relaxed text-gray-600 text-left md:text-center lg:text-center p-2 lg:p-8 md:text-lg">This is BF Customer, the customer end of BFShop. Here, you will be able to place 
                        orders which will appear in BF Merchant, which you can get to by going back and to the Merchant interface (when it's built).
                    </h2>
                
            </div>
            <div className="hidden md:hidden lg:block">
            <div className="flex fixed right-0 top-20 z-20 bg-neutral-200 translate-x-4/5 hover:translate-x-0 transition-transform duration-300">
                <div className=" w-1/5 p-4 flex items-center justify-center p-8">
                    <ShoppingBasketIcon sx={{ 
                        color: "orange",
                        fontSize: 32
                     }}/>
                </div>
                <div className=" w-4/5 p-4 flex flex-col items-center p-8">
                    <p></p>
                </div>
                </div>
            </div>
            <div onClick={() => setIsOpen(!isOpen)}
                className={`flex lg:hidden fixed right-0 top-20 z-100 bg-neutral-200 rounded-md ${isOpen ? "translate-x-0" : "translate-x-4/5"} transition-transform duration-300`}>
                <div className=" w-1/5 p-4 flex items-center justify-center p-8">
                    <ShoppingBasketIcon sx={{ 
                        color: "orange",
                        fontSize: 32
                     }}/>
                </div>
                <div className=" w-4/5 p-4 flex flex-col items-center p-8">
                    {cartItems.map((cartItem, index) => (
                        <div key={index} className="border">
                            <div>{cartItem.title}</div>
                            <img src={cartItem.thumbnail} />
                            <div>{cartItem.price}</div>
                        </div>
                        
                        ))}
                </div>
            </div>
            <p className="font-inter text-2xl font-semibold text-neutral-950">Have a browse!</p>
            {isLoading ? (
                <p className="font-inter text-lg text-gray-500">Products loading...</p>
            ) : (
            <div className="min-w-screen grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {products.map((product, index) => (
                <div className=" group" key={index}>
                    <div className= "relative  flex flex-col justify-center items-center h-48 md:h-48 lg:h-64 transition-transform duration-300 group-hover:-translate-x-12">
                        <div className="absolute flex flex-col items-center justify-center h-2/3 w-2/3 z-20 text-sm md:text-lg lg:text-lg">
                            <img src ={product.thumbnail ?? "/bg3.jpg"} alt="Item Image" />
                            <p className="font-inter">{product.title ?? "Item Name"}</p>
                            <p className="block lg:hidden font-inter"> {product.price}</p>
                            
                        </div>
                    <div className=" flex flex-col hidden lg:block absolute z-10 transition-all duration-300 opacity-0 group-hover:translate-x-38 group-hover:opacity-100  w-1/3 space-y-2">
                       
                        <p className="font-inter text-sm">{product.price}</p>
                        <p className="font-inter text-sm">Details</p>
                        <div>
                            <form 
                                onSubmit={handleSubmit}
                                id="expense-form">
                                <input 
                                    className="w-1/2 shadow-lg"
                                    type="number"
                                    value={selection}
                                    onChange={e => setSelection(Number(e.target.value) || 0)}
        
                                />
                          
                                   
                       
                        
                        <button
                            type="submit"
                            className=" cursor-pointer transition-transform hover:scale-120  p-0 m-0 appearance-none"
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