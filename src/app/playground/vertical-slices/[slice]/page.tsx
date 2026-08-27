"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMerchantTheme } from "../../../(merchant)/merchant/useMerchantTheme";

const documentClass = "mt-4 space-y-4 text-zinc-700";

function SliceContent({ slice }: { slice: string }) {
  if (slice === "slice-1") {
    return (
      <>
        <p>This slice uses an API, service, and data-access layer architecture. The original plan was to include an application layer between the API and service, but this seemed needless as it was just another layer which had no real function. The entirety of the place order functionality deals with the service layer taking data from the placed order, referencing it against the database, and creating a new order and its items. This document focuses on that, with the database operations mentioned but not discussed in too much detail as they are very simple.</p>
        <p>The logic accounts in part for the fact that the client supplies only product identity and quantity, while product metadata and pricing are resolved server-side from the database. This prevents client-controlled values such as price from becoming authoritative order data.</p>
        <h2 className="pt-6 font-inter text-2xl font-semibold text-zinc-950 md:text-3xl">Frontend</h2>
        <p>The place order button in the cart triggers an event handler which accesses localStorage, which the cart is also derived from. Order data is produced from this and sent to the API.</p>
        <h2 className="pt-6 font-inter text-2xl font-semibold text-zinc-950 md:text-3xl">API</h2>
        <p>First is the API. The order data from the request body is stored in the order variable and a validation check is done on it.</p>
        <p>The createOrderService function is called and the order passed to it.</p>
        <h2 className="pt-6 font-inter text-2xl font-semibold text-zinc-950 md:text-3xl">Service</h2>
        <p>In the service, a transaction is started. This is essential as it provides atomicity for the database operations, avoiding situations such as where stock is decremented before the order is placed, and another order takes the last item of stock. The transaction will prove to be problematic later.</p>
        <p>The service is structured as multiple smaller functions. The code grouping was done so as to make each function obvious. The names too.</p>
        <h3 className="pt-4 font-inter text-xl font-semibold text-zinc-950 md:text-2xl">processCustomer</h3>
        <p>The first, processCustomer, is intended to compare the customer ID sent down with the order. It does this by calling getCustomer_DB_op, which finds the customer in the database with a matching ID. If this fails then an error is thrown, meaning the database operation acts as validation and so extra checks aren&apos;t needed in the service.</p>
        <p>In BFshop&apos;s first iteration, the customer ID is hardcoded as always one for simplicity. Output of the operation is stored in customer.</p>
        <h3 className="pt-4 font-inter text-xl font-semibold text-zinc-950 md:text-2xl">processProduct</h3>
        <p>The next function is processProduct and this is more complex. At this point we only have the product ID, so we need to find the real product in the database.</p>
        <p>Another database operation, getProduct_DB_op, is called. This gives us an array of products with corresponding IDs. For each, a variable is created which tests for matching IDs between server-side products and client-side products.</p>
        <p>There is a check, in the database operation, to match the new products array length to the product IDs length to act as validation, but this does not correctly handle duplicate product IDs and is marked for replacement during validation hardening.</p>
        <p>If successful, the next check is carried out, which makes sure there is adequate stock to match the quantity property of the order item. Products is returned to the function.</p>
        <h3 className="pt-4 font-inter text-xl font-semibold text-zinc-950 md:text-2xl">createOrderItems</h3>
        <p>Then we create the order items. We have to create them before creating the order as we need them to calculate the order total, but we cannot write them to the database, as they rely on the order ID.</p>
        <p>A map function matches product IDs from the order to product IDs from the previously made products variable, and creates one object per ID.</p>
        <p>The order item, named backendOrderItem to distinguish it from the items of the incoming order, is created with the properties product_id, line_total, quantity, unit_price, and product_name.</p>
        <h3 className="pt-4 font-inter text-xl font-semibold text-zinc-950 md:text-2xl">createOrder and writeOrderItems</h3>
        <p>In createOrder, aggregation of the created order items is carried out using reduce so we can determine the total of the order.</p>
        <p>The rest of order data is formed and passed to the called database operation, WriteOrderDB_op, which writes the order to the order table in the database.</p>
        <p>backendOrderItem[] is mapped over in writeOrderItems, and its outputs are passed to the final database operation, WriteOrderItems_DB_op.</p>
        <p>createOrder is returned and the transaction ended.</p>
        <h2 className="pt-6 font-inter text-2xl font-semibold text-zinc-950 md:text-3xl">Architectural decisions</h2>
        <ul className="list-disc space-y-2 pl-6"><li>An application layer was omitted as it was effectively just another API layer.</li><li>Higher quality validation and other specificities were omitted to allow for quicker progress.</li></ul>
        <h2 className="pt-6 font-inter text-2xl font-semibold text-zinc-950 md:text-3xl">Problems</h2>
        <p>The transaction returned a failure code every time despite the programming being correct. By turning off pooling in Neon, the database service in use, this was abated.</p>
        <h2 className="pt-6 font-inter text-2xl font-semibold text-zinc-950 md:text-3xl">Relevant data entities</h2>
        <pre className="overflow-auto rounded-md bg-zinc-100 p-4 font-mono text-sm leading-relaxed">{`CreateOrderRequest {
  items: OrderItem[];
  customerId: number;
}

OrderItem { productId: number; quantity: number; }
ProductsType { id: number; title: string; price: number; stock: number; }
CustomerType { id: number; }
BackendOrderItem { product_id: number; quantity: number; line_total: number; unit_price: number; product_name: string; }
CreatedOrder { customer_id: number; status: string; total: number; created_at: Date; id: number; }
WrittenOrderItems { id: number; order_id: number; product_id: number; product_name: string; quantity: number; unit_price: number; line_total: number; }`}</pre>
      </>
    );
  }

  if (slice === "slice-2") {
    return (
      <>
        <p>The goal of Slice 2 is to display orders in received, sent, and delivered dashboards for the merchant, and allow the merchant to mark orders from received to sent and from sent to delivered.</p>
        <p>Slice 2 is effectively two slices together: displaying orders is one and marking orders is the other. As marking orders is complementary to displaying orders, they are treated as one.</p>
        <h2 className="pt-6 font-inter text-2xl font-semibold text-zinc-950 md:text-3xl">Architecture</h2>
        <p>The slice started with the idea of avoiding a service like the one used in Slice 1 and instead having orders mapped to the frontend from objects storing the output of database operations.</p>
        <p>This proved impossible because server-side data returned by database operations is not presentable client-side. APIs are used as the server/client boundary partly because they can serialize data into a transferable format such as JSON. Attempting to circumvent an API was unwise.</p>
        <p>A traditional API, service, repository, and database layer structure was therefore chosen, resulting in the architecture shown below.</p>
        <img src="/assets/slice2.png" alt="Slice 2 architecture showing the API, service, repository, and database layers." className="my-8 w-full rounded-md border border-zinc-200 object-contain" />
        <p>This slice includes only the bare minimum functionality needed to create the scaffolding for BFshop, so it is intentionally light. Additions are discussed at the end.</p>
        <h2 className="pt-6 font-inter text-2xl font-semibold text-zinc-950 md:text-3xl">Displaying orders</h2>
        <p>The architecture uses three services for displaying orders: receivedOrdersService, sentOrdersService, and deliveredOrdersService.</p>
        <p>Each service uses getOrders_DB_op. Separate database operations for retrieving received, sent, and delivered orders were originally used, but this caused problems: only two boards would load at a time and an error reported too many connections to Neon, the database.</p>
        <p>getOrders_DB_op simply retrieves all orders from the database and returns them as orders. Each service then creates a variable for its relevant status and filters the returned orders where order.status equals delivered, received, or sent.</p>
        <p>The services are called by their respective APIs. The APIs return the filtered orders to the frontend, where they are mapped to their respective columns.</p>
        <h2 className="pt-6 font-inter text-2xl font-semibold text-zinc-950 md:text-3xl">Marking orders</h2>
        <p>Marking orders follows a similar pattern, with an API calling a service. The structural difference is that different database operations are used for marking orders as sent and delivered.</p>
        <p>Because the button to mark an order is rendered as part of a map function, its event handler needs the order ID. That ID is passed down the chain and finally used in the repositories to find the order and update its status column.</p>
        <p>Once updated, an order is picked up by a different display service. For example, when a received order has its status changed to sent, the next call to receivedOrdersService will not pick it up from the orders object returned by getOrders_DB_op; sentOrdersService will pick it up instead.</p>
        <h2 className="pt-6 font-inter text-2xl font-semibold text-zinc-950 md:text-3xl">Final word</h2>
        <p>The whole chain is intentionally very light, so there is not much to discuss beyond the basic architecture. The service does not act like a service currently: no business logic is executed and nothing particularly complex happens. It is structured this way so that when more is added in the future, the structure is already ready for it.</p>
        <h2 className="pt-6 font-inter text-2xl font-semibold text-zinc-950 md:text-3xl">Future additions</h2>
        <ul className="list-disc space-y-2 pl-6"><li>Include an order-items viewing option in the frontend; this requires an additional API.</li><li>Include persistence for status-column changes to allow for visual effects when orders change columns.</li><li>Include a fourth status option: verified delivered.</li><li>Add validation to ensure each API and service is receiving the correct data.</li></ul>
      </>
    );
  }

  return <p>Start writing this slice document here.</p>;
}

export default function VerticalSliceDocumentPage() {
  const { slice } = useParams<{ slice: string }>();
  const { lightMode, toggleTheme } = useMerchantTheme();

  return (
    <main className={`min-h-screen px-4 py-6 transition-colors md:px-6 md:py-8 lg:px-8 lg:py-12 ${lightMode ? "bg-zinc-100 text-zinc-950" : "bg-zinc-900 text-white"}`}>
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link href="/playground/vertical-slices" className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 font-inter text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${lightMode ? "border-zinc-300 bg-white text-zinc-800 hover:border-sky-600 hover:text-sky-700" : "border-white/20 bg-white/[0.08] text-zinc-100 hover:border-sky-400 hover:text-sky-300"}`}>
            <ArrowBackIcon fontSize="small" />
            Back
          </Link>
          <button type="button" onClick={toggleTheme} aria-label={`Switch to ${lightMode ? "dark" : "light"} mode`} title={`Switch to ${lightMode ? "dark" : "light"} mode`} className={`grid size-11 place-items-center rounded-md border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${lightMode ? "border-zinc-300 bg-white text-zinc-800 hover:border-sky-600 hover:text-sky-700" : "border-white/20 bg-white/[0.08] text-zinc-100 hover:border-sky-400 hover:text-sky-300"}`}>
            {lightMode ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
          </button>
        </div>

        <article className="mx-auto mt-10 max-w-4xl bg-white px-8 py-12 text-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.22)] md:mt-16 md:min-h-[900px] md:px-16 md:py-20 lg:px-24">
          <h1 className="font-bebas text-4xl leading-tight tracking-[0.08em] md:text-5xl">{slice === "slice-1" ? "Slice 1: Place Order" : slice === "slice-2" ? "Slice 2: Manage Orders" : "Vertical slice document"}</h1>
          <div className="mt-8 border-t border-zinc-200 pt-8 font-inter text-base leading-relaxed md:mt-10 md:pt-10" aria-label="Vertical slice document">
            <div className={documentClass}>
              <SliceContent slice={slice} />
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
