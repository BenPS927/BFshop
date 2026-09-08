"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMerchantTheme } from "../../../(merchant)/merchant/useMerchantTheme";

const documentClass = "mt-4 space-y-4 text-zinc-700";

const sliceThreeAcronyms = [
  ["AI", "Artificial Intelligence"],
  ["AM", "Analysis Machine"],
  ["API", "Application Programming Interface"],
  ["AR", "Analysis Request"],
  ["II", "Intelligence Interface"],
  ["MHDB", "Metric History Database"],
  ["MHM", "Metric History Machine"],
  ["RC", "Results Contract"],
  ["VI", "Visual Interface"],
] as const;

function AcronymEntries() {
  return (
    <dl className="mt-3 space-y-2">
      {sliceThreeAcronyms.map(([acronym, meaning]) => (
        <div key={acronym}>
          <dt className="font-semibold text-sky-700">{acronym}</dt>
          <dd className="text-zinc-600">{meaning}</dd>
        </div>
      ))}
    </dl>
  );
}

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

  if (slice === "slice-3") {
    return (
      <>
        <h2 className="font-inter text-2xl font-semibold leading-snug text-zinc-950 md:text-3xl lg:text-4xl">Summary and structure</h2>
        <p>Slice 3 establishes the machinery for requesting, calculating and presenting BFshop&apos;s foundational business metrics.</p>
        <p>Its central architectural elements are the Analysis Request, the Analysis Machine, metric history, and the Results Contract.</p>
        <p>Although chart controls and query interfaces belong conceptually to Slice 5, limited versions are developed here so Slice 3&apos;s analytical machinery can be tested.</p>
        <p>Slice 3 is currently under construction and in its current form it contains two pieces of code for retrieving data from the databases, a frontend interface for sending queries to those pieces of code.</p>
        <p>The next stages are to establish data shapes that will allow for a repeatable structure for data representation.</p>

        <h2 className="pt-6 font-inter text-2xl font-semibold leading-snug text-zinc-950 md:text-3xl lg:text-4xl">Evolution</h2>
        <p>The first thing to establish was &apos;what is this slice actually trying to achieve?&apos;</p>
        <p>The first goal was to have basic business metrics calculated so they can be presented as graphs. See section 1 to read further detail on this.</p>
        <p>The second goal was to be able to test variable queries, such as &apos;how much revenue came from males between x and y dates?&apos;.</p>
        <p>The first goal could be achieved by having ready to go charts where each is rendered by calls to an API and shows its particular set of data.</p>
        <p>The second goal is more complex because it introduces variety of queries.</p>
        <p>I needed a way of testing queries, so a visual interface was needed, forcing this slice into territory of Slice 5: Intelligence Interface.</p>
        <p>It made sense that this visual interface (VI from hereon) would serve in place of the eventual merchant interface in /merchant/data, and also in the project portal, so site visitors are immediately presented with the current stage of the project. Two copies of the same interface with the same inputs and using the same datasets.</p>
        <p>So, as both goals required querying a dataset, differing only in the variability of the queries, and the VI was to represent the progress in the analysis process and the progress towards a final user interface, it became clear that this slice would rely upon a structure, or a process, by which the data can be queried, and filtered on its properties.</p>
        <p>This sounds obvious, and it is, but what I refer to is a scaffold on which the project will rest, a set of boundaries on whose sides different services and functions will reside, interacting to allow for variety in input and output.</p>
        <p>This approach allows for simplicity to start with room for added depth later (a concept on which BFshop has so far been built).</p>

        <h3 className="pt-6 font-inter text-xl font-semibold leading-snug text-zinc-950 md:text-2xl lg:text-3xl">Development</h3>

        <h4 className="pt-4 font-inter text-lg font-medium leading-snug text-zinc-950 md:text-xl lg:text-2xl">Data Foundations and Analysis Machine</h4>
        <p>The first thing was to define the data foundations and how these would be dissected for different views on the data. (I failed to conceive of the later-realised and highly important Analysis Request and Results Contract.)</p>
        <p>Three &apos;layers&apos; of information were roughly defined:</p>
        <p><strong>Totals:</strong> Direct measurements of business activity, such as revenue, orders, items sold and customers*</p>
        <p><strong>Derivations:</strong> New information calculated from one or more totals, such as average order value, revenue per customer, percentage change and rolling averages</p>
        <p><strong>Filters:</strong> Conditions used to limit which records contribute to totals and derivations, such as period, gender, age, location, product or category</p>
        <p>*customers are currently deferred for simplicity</p>
        <p>Totals would be orders, customers, items sold, and revenue. These could then be filtered by time, person (gender, location, age) and product (product id, category).</p>
        <p>A great deal of debate was had on a number of questions:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>How should various elements be both separate and collaborative with one another?</li>
          <li>How should meaningful patterns and relationships be identified without mistaking randomness for something important (slice 4 territory)?</li>
          <li>What should be calculated on demand vs prior to being asked?</li>
          <li>What should be stored historically and at what level of detail?</li>
          <li>How can deterministic tools be used to minimize the scope of AI?</li>
        </ul>
        <p>It was soon realized that an architecture involving a central piece of machinery would be needed to draw together the totals and the filtering devices.</p>
        <p>From this the analysis machine (AM) was built.</p>
        <p>Then I realized that with such a machine, the output would be determined by the input, rather than the initial idea of applying filters to predefined totals.</p>
        <p>So the analysis machine is effectively a service, similar to placeOrderService.</p>
        <p>The AM would extract all orders, along with the related customer and order items, from the database (not a long term ideal solution but acceptable for a learning project), and filter by whichever arguments were passed into the AM representing filters.</p>
        <p>It was soon realized that filtering by time, or period as it will be now referred to, is too fundamental to have period included in filters; the reasoning being that without a time dimension (in the absence of different data entities or sources such as in the case of comparisons) a historical metric is reduced to a single total rather than a series showing change. And so historical charts, such as would form the basis of most charts in an analytics workspace, would always need to be filtered by period.</p>
        <p>As a result of this the data entity going into the AM was properly defined:</p>
        <img src="/assets/slice3-analysis-request.png" alt="Analysis Request hierarchy showing metrics, period, and filters with their values." className="my-8 w-full rounded-md border border-zinc-200 object-contain" />
        <p>Period is on the same level within Analysis Request as metric and filters, reflecting its importance. This object is absolutely fundamental to slice 3 and gives us an object around which we can build the rest of the machinery.</p>
        <p>(I now recognize that the period object needs to be reshaped and so this shape is not final).</p>
        <p>A charting package was installed and the VI was built as means for testing the AM. This was the first step in creating an instance of a VI, or at the least a way of testing the AM</p>

        <h4 className="pt-4 font-inter text-lg font-medium leading-snug text-zinc-950 md:text-xl lg:text-2xl">Metric History</h4>
        <p>The idea of persisted data was always in the periphery; it made sense to save some form of the AM&apos;s output.</p>
        <p>This idea was realized as the solution to the limitation of the VI; it could only produce one data point per query; filtering revenue by date added the revenue of each day in that period and returned it as one number. A solid first step but not much use for eCommerce merchants.</p>
        <p>Persisted data was the answer.</p>
        <p>And the AM provided the perfect way to create that.</p>
        <p>It was decided that the Metric History Machine (MHM) was to be a similar device to the AM, but focused on &apos;simpler&apos; and historical data, drawing from a (at this point imaginary) database where each row would represent a day and each column a total (revenue, orders, etc) for that day.</p>
        <p>The MHM would retrieve individual values for specific days, providing historical data.</p>
        <p>This was done as a new machine rather than an extension of the AM for separation of concerns.</p>
        <p>For this to fit in three main things were needed:</p>
        <ol className="list-decimal space-y-2 pl-6">
          <li>The actual persisted data</li>
          <li>Some mechanism for queries to reach either the AM or the MHM</li>
          <li>A shared data shape</li>
        </ol>
        <ol className="list-decimal space-y-4 pl-6">
          <li>This one was simple; an n8n automation runs daily and sends a date to an API endpoint. A snapshot service constructs a request for the AM, running it for revenue, orders and items sold. The results are written to the Metric History Database (MHDB). All that is needed is time (supposing it all works).</li>
          <li>A &apos;request router&apos; function was built between the AM and API, where the request (more on the request later) is assessed; if the request contains only metric and period (such as orders placed in July) then it goes to the MHM. If it also contains a filter it goes to the AM.</li>
          <li>This led me to the realization on how fundamental data is to the project, and how the shape of the data coming down in the query and the data being sent back up in response, should have been determined among the very first things when building this slice. The next section will focus on these.</li>
        </ol>

        <h4 className="pt-4 font-inter text-lg font-medium leading-snug text-zinc-950 md:text-xl lg:text-2xl">Data entities and chart building scaffolding</h4>
        <p>I realized the data entities passing up and down the chain would be fundamental to the earlier mentioning of a &apos;structure, or a process, by which the data can be queried, and filtered on its properties&apos;, which itself would be a step towards a standardized chart creation architecture.</p>
        <p>This led me to realise that chart creation variability could be achieved by mapping properties of a returning data structure to the visuals of a chart or the data shown on it; the title property becomes the title of the chart, a series of values becomes the plotted data.</p>
        <p>This birthed the need to standardize two data shapes which together could be used universally in the project to call up almost any chart.</p>
        <p>These are the results contract (RC) and the analysis request (AR). The AR would be populated with a query (for example revenue for a certain period from males), and the returning RC would include the information needed to produce a chart showing that information.</p>
        <p>The ultimate variability in the RC and AR would allow for enormous variability in chart creation, providing an architecture which could be used throughout the project for calling up information, as well as providing visual analysis (in the case of overlaid averages, comparisons, breakdowns and scatter plots) without even creating actual analysis machinery.</p>

        <h5 className="pt-3 font-inter text-base font-semibold leading-snug text-zinc-950 md:text-lg">Structural Changes</h5>
        <p>I soon realized the AM could be used for all the current data retrieval. The MHM was redundant, but having daily snapshots of the metrics (the MHDB) would still be useful at some point.</p>
        <p>All queries were rewired to go through the AM, and it was rebuilt to create custom database queries for only the given request, where it had been previously extracting all data and extracting from that, which was never a final solution.</p>
        <p>This also brought into name the role of the AM, as it itself was no longer an analysis machine; its actual behaviour involved the calling of different functions such as totals and interval calculations and of course the database operation. It was renamed to metricAnalysisService. This is better because it correctly calls it a service but not perfect as it does not do analysis.</p>
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

        {slice === "slice-3" && (
          <aside className="fixed right-4 top-24 z-20 hidden w-44 rounded-lg border border-zinc-200 bg-white/95 p-4 font-inter text-xs leading-normal text-zinc-700 shadow-[0_12px_30px_rgba(0,0,0,0.16)] backdrop-blur xl:block" aria-label="Acronym key">
            <p className="font-semibold uppercase tracking-[0.12em] text-zinc-950">Acronym key</p>
            <AcronymEntries />
          </aside>
        )}

        <article className="mx-auto mt-10 max-w-4xl bg-white px-8 py-12 text-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.22)] md:mt-16 md:min-h-[900px] md:px-16 md:py-20 lg:px-24">
          {slice === "slice-3" && (
            <details className="sticky top-3 z-20 mb-6 rounded-lg border border-zinc-200 bg-white/95 p-3 font-inter text-xs leading-normal text-zinc-700 shadow-md backdrop-blur xl:hidden">
              <summary className="cursor-pointer font-semibold uppercase tracking-[0.12em] text-zinc-950">Acronym key</summary>
              <AcronymEntries />
            </details>
          )}
          <h1 className="font-bebas text-4xl leading-tight tracking-[0.08em] md:text-5xl">{slice === "slice-1" ? "Slice 1: Place Order" : slice === "slice-2" ? "Slice 2: Manage Orders" : slice === "slice-3" ? "Slice 3: Metrics and History" : "Vertical slice document"}</h1>
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
