
type Order = {
  id: number;
  name: string;
  price: number;
  date: string;
  address: string;
};

type OrderPanelProps = {
    title: string;
    orders: Order[];
    children?: React.ReactNode; 

}

export default function OrderPanel(props: OrderPanelProps) {

    

  return (
    <main className="border p-6 w-full min-w-[250px] max-w-[400px] rounded-md shadow-lg overflow-auto h-full">
        <div className=" space-y-3 rounded-md">
            <h2 className="Class: font-inter font-semibold text-2xl md:text-3xl lg:text-4xl leading-snug text-center">{props.title}</h2>
            {props.orders.map(order => (
                <div 
                    key={order.id}
                    className="border-b gap-8 py-2 flex flex-row text-sm">
                        <span>{order.name}</span>
                        <span>{order.price}</span>
                        <span>{order.date}</span>
                        <span>{order.address}</span>
                        
                </div>
            ))}
        </div>
      
    </main>
  );
}
