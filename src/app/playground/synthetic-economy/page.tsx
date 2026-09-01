"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import Link from "next/link";
import { useMerchantTheme } from "../../(merchant)/merchant/useMerchantTheme";

const sectionHeading = "font-inter text-2xl font-semibold leading-snug md:text-3xl lg:text-4xl";
const section = "mt-10 md:mt-12";
const content = "mt-4 space-y-4 text-zinc-700";

export default function SyntheticEconomyPage() {
  const { lightMode, themeReady, toggleTheme } = useMerchantTheme();

  return (
    <main className={`min-h-screen px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-12 ${themeReady ? "opacity-100" : "opacity-0"} ${lightMode ? "bg-zinc-100 text-zinc-950" : "bg-zinc-900 text-white"}`}>
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link href="/" className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 font-inter text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${lightMode ? "border-zinc-300 bg-white text-zinc-800 hover:border-sky-600 hover:text-sky-700" : "border-white/20 bg-white/[0.08] text-zinc-100 hover:border-sky-400 hover:text-sky-300"}`}>
            <ArrowBackIcon fontSize="small" />
            Back
          </Link>
          <button type="button" onClick={toggleTheme} aria-label={`Switch to ${lightMode ? "dark" : "light"} mode`} title={`Switch to ${lightMode ? "dark" : "light"} mode`} className={`grid size-11 place-items-center rounded-md border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${lightMode ? "border-zinc-300 bg-white text-zinc-800 hover:border-sky-600 hover:text-sky-700" : "border-white/20 bg-white/[0.08] text-zinc-100 hover:border-sky-400 hover:text-sky-300"}`}>
            {lightMode ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
          </button>
        </div>

        <article className="mx-auto mt-10 max-w-4xl bg-white px-8 py-12 text-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.22)] md:mt-16 md:px-16 md:py-20 lg:px-24">
          <h1 className="font-bebas text-4xl leading-tight tracking-wide md:text-5xl lg:text-6xl">Synthetic Economy</h1>
          <div className="mt-8 space-y-4 border-t border-zinc-200 pt-8 font-inter text-base leading-relaxed md:mt-10 md:pt-10 md:text-lg">
            <p>BFshop has a constant flow of generated orders being placed, providing the dataset which the backend machinery will analyse and the intelligence interface will present.</p>
            <p>The orders are generated in such a way that the &apos;customers&apos; appear to have basic traits which influence their &apos;spending&apos;.</p>
            <p>This economy will regularly be updated to add complexity. It is now in its early stages but future plans include several customer traits which influence spending, which themselves can be influenced by other factors relating to the &apos;business&apos; and wider &apos;world&apos;.</p>

            <section className={section}>
              <h2 className={sectionHeading}>Details</h2>
              <div className={content}>
                <p>An n8n workflow runs every 5 minutes, taking an existing customer from the database, running some code, and then (or not) placing an order.</p>
                <p>The basic model is:</p>
                <p className="rounded-md bg-zinc-100 p-4 font-medium text-zinc-950">Customer traits + random variation + available products = generated order</p>
              </div>
            </section>

            <section className={section}>
              <h2 className={sectionHeading}>Overview</h2>
              <div className={content}>
                <p>Each time the n8n workflow runs:</p>
                <ol className="list-decimal space-y-2 pl-6">
                  <li>One existing customer is selected randomly.</li>
                  <li>Their buy eagerness determines whether they place an order.</li>
                  <li>If they buy, their spend eagerness determines approximately how much they spend.</li>
                  <li>Available products are selected to build a basket near that amount.</li>
                  <li>The basket and existing customer are sent to BFshop.</li>
                  <li>BFshop validates and records the order through its normal order service.</li>
                </ol>
                <p>A workflow execution can therefore produce either no order or one order belonging to an existing customer.</p>
              </div>
            </section>

            <section className={section}>
              <h2 className={sectionHeading}>Customer Traits</h2>
              <div className={content}>
                <p>Each customer has two persistent behavioural traits stored in Neon:</p>
                <p><strong>Buy eagerness:</strong> 1–10</p>
                <p><strong>Spend eagerness:</strong> 1–10</p>
                <p>These values are generated once and remain attached to that customer.</p>
              </div>
            </section>

            <section className={section}>
              <h2 className={sectionHeading}>Buy Eagerness</h2>
              <div className={content}>
                <p>Buy eagerness represents the customer&apos;s likelihood of buying when selected.</p>
                <p>The calculation is:</p>
                <p className="rounded-md bg-zinc-100 p-4 font-medium text-zinc-950">Purchase probability = buy eagerness ÷ 10</p>
                <p>Examples:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Buy eagerness 1 = 10% chance of buying</li>
                  <li>Buy eagerness 4 = 40% chance of buying</li>
                  <li>Buy eagerness 7 = 70% chance of buying</li>
                  <li>Buy eagerness 10 = 100% chance of buying</li>
                </ul>
                <p>A customer with a buy eagerness of 7 does not necessarily buy seven times during a particular period. They have a 70% chance of buying each time the workflow selects them.</p>
              </div>
            </section>

            <section className={section}>
              <h2 className={sectionHeading}>Spend Eagerness</h2>
              <div className={content}>
                <p>Spend eagerness represents how much the customer is inclined to spend when they buy.</p>
                <p>It is converted into a target between two configurable values:</p>
                <p><strong>Minimum order value:</strong> 20</p>
                <p><strong>Maximum order value:</strong> 500</p>
                <p>The customer&apos;s spend eagerness places them proportionally between these minimum and maximum values.</p>
                <p>The calculation is:</p>
                <div className="space-y-2 rounded-md bg-zinc-100 p-4 font-medium text-zinc-950">
                  <p>Position = (spend eagerness − 1) ÷ 9</p>
                  <p>Base target = minimum order value + position × (maximum order value − minimum order value)</p>
                </div>
                <p>Random variation of plus or minus 20% is then applied.</p>
                <p>This means the same customer does not spend exactly the same amount every time.</p>
              </div>
            </section>

            <section className={section}>
              <h2 className={sectionHeading}>Example</h2>
              <div className={content}>
                <p>A customer has:</p>
                <p><strong>Buy eagerness:</strong> 4</p>
                <p><strong>Spend eagerness:</strong> 3</p>
                <p>They have a 40% chance of purchasing when selected.</p>
                <p>Their base spending target is approximately 126.67 currency units.</p>
                <p>After the random variation is applied, their target will usually fall between approximately 101 and 152 currency units.</p>
                <p>An order worth 120 currency units is therefore consistent with their behaviour.</p>
              </div>
            </section>

            <section className={section}>
              <h2 className={sectionHeading}>Workflow Structure</h2>
              <div className={content}>
                <p>The workflow follows this sequence:</p>
                <ol className="list-decimal space-y-2 pl-6">
                  <li>The n8n schedule triggers the workflow.</li>
                  <li>A Postgres query retrieves a random customer and the available products.</li>
                  <li>The Code node performs the buying decision.</li>
                  <li>If the customer buys, the Code node calculates a spending target.</li>
                  <li>The Code node constructs a basket using available products.</li>
                  <li>An HTTP request sends the proposed order to BFshop.</li>
                  <li>BFshop&apos;s existing generated-order service validates and records the order.</li>
                </ol>
              </div>
            </section>

            <section className={section}>
              <h2 className={sectionHeading}>Database Query</h2>
              <div className={content}>
                <p>The Postgres node retrieves:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>One randomly selected customer</li>
                  <li>The customer&apos;s buy and spend eagerness values</li>
                  <li>All products with stock available</li>
                  <li>Each product&apos;s ID, price and current stock level</li>
                </ul>
                <p>Customers are selected uniformly. Every customer has approximately the same chance of being selected.</p>
                <p>Buy eagerness affects what happens after selection. It does not affect the likelihood of being selected.</p>
              </div>
            </section>

            <section className={section}>
              <h2 className={sectionHeading}>Buying Decision</h2>
              <div className={content}>
                <p>The Code node generates a random number between zero and one.</p>
                <p>This number is compared with the selected customer&apos;s purchase probability.</p>
                <p>If the random number exceeds the purchase probability, the customer does not buy and the Code node returns no output.</p>
                <p>Returning no output prevents that workflow execution from reaching the HTTP Request node.</p>
                <p>Unsuccessful purchase opportunities are not currently recorded.</p>
              </div>
            </section>

            <section className={section}>
              <h2 className={sectionHeading}>Basket Construction</h2>
              <div className={content}>
                <p>If the customer buys:</p>
                <ol className="list-decimal space-y-2 pl-6">
                  <li>A target order value is calculated from their spend eagerness.</li>
                  <li>Products without stock are removed.</li>
                  <li>The remaining products are placed in a random order.</li>
                  <li>Products are added while there is space in the target budget.</li>
                  <li>Quantities are limited by the remaining budget, available stock and configured maximum quantity.</li>
                </ol>
                <p>The current limits are:</p>
                <p><strong>Maximum number of different products:</strong> 5</p>
                <p><strong>Maximum quantity of one product:</strong> 5</p>
                <p>A product is skipped if one unit would exceed the remaining target.</p>
                <p>If no product fits within the target, the cheapest available product is added. This ensures that a customer who passes the buying decision produces an order. In this situation, the final value may exceed the original target.</p>
              </div>
            </section>

            <section className={section}>
              <h2 className={sectionHeading}>Generated Data</h2>
              <div className={content}>
                <p>The Code node produces three groups of information:</p>
                <h3 className="pt-2 font-inter text-xl font-semibold leading-snug text-zinc-950 md:text-2xl lg:text-3xl">Customer</h3>
                <ul className="list-disc space-y-2 pl-6"><li>ID</li><li>Name</li><li>Email</li><li>Address</li><li>Age</li><li>Gender</li></ul>
                <h3 className="pt-2 font-inter text-xl font-semibold leading-snug text-zinc-950 md:text-2xl lg:text-3xl">Order items</h3>
                <ul className="list-disc space-y-2 pl-6"><li>Product ID</li><li>Quantity</li></ul>
                <h3 className="pt-2 font-inter text-xl font-semibold leading-snug text-zinc-950 md:text-2xl lg:text-3xl">Simulation information</h3>
                <ul className="list-disc space-y-2 pl-6"><li>Buy eagerness</li><li>Spend eagerness</li><li>Target spend</li><li>Estimated spend</li></ul>
                <p>Only the customer and order items are sent to BFshop.</p>
                <p>The simulation information remains available in n8n for inspecting and debugging workflow executions.</p>
              </div>
            </section>

            <section className={section}>
              <h2 className={sectionHeading}>BFshop&apos;s Responsibility</h2>
              <div className={content}>
                <p>n8n proposes the order, but BFshop remains authoritative.</p>
                <p>The generated-order service:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Finds the existing customer by ID</li><li>Retrieves the authoritative product records</li><li>Uses server-side product prices</li><li>Checks available stock</li><li>Calculates each order-item total</li><li>Calculates the final order total</li><li>Writes the order and its order items to the database</li>
                </ul>
                <p>This prevents n8n from becoming authoritative for prices or recorded totals.</p>
                <p>The customer ID is the authoritative customer identifier. Names are not unique, so two people named Jack Thompson are still treated as separate customers.</p>
              </div>
            </section>

            <section className={section}>
              <h2 className={sectionHeading}>Database Defaults</h2>
              <div className={content}>
                <p>New customers receive random buy and spend eagerness values between 1 and 10 through database defaults.</p>
                <p>BFshop does not currently read or write these properties through Prisma. Neon assigns them automatically when a customer is created.</p>
              </div>
            </section>

            <section className={section}>
              <h2 className={sectionHeading}>Behaviour Currently Produced</h2>
              <div className={content}>
                <p>The synthetic economy can produce:</p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Customers who buy frequently and spend heavily</li><li>Customers who buy frequently but spend little</li><li>Customers who buy infrequently but spend heavily</li><li>Customers who buy infrequently and spend little</li><li>Returning customers with repeated order histories</li><li>Natural variation between orders from the same customer</li>
                </ul>
              </div>
            </section>

            <section className={section}>
              <h2 className={sectionHeading}>Current Limitations</h2>
              <div className={content}>
                <ul className="list-disc space-y-2 pl-6">
                  <li>Orders are unrealistic; one may contain an apple, two beds and mascara for example</li><li>No more than one order can be created per run.</li><li>Product selection remains random.</li><li>Customers do not yet have product or category preferences.</li><li>Age, gender and location do not currently influence behaviour.</li><li>Buy and spend eagerness are initially assigned randomly.</li><li>Failed buying opportunities are not recorded.</li><li>The spending target is approximate because stock and product prices constrain the basket.</li><li>The small historical name pool has produced duplicate names.</li><li>Names and genders were previously generated independently, producing some unrealistic combinations.</li><li>Only one customer is considered during each workflow run.</li>
                </ul>
                <p>These are limitations of realism rather than failures in the ordering architecture.</p>
              </div>
            </section>

            <section className={section}>
              <h2 className={sectionHeading}>Planned Extensions</h2>
              <div className={content}>
                <p>Demographic information may later influence the probability with which behavioural traits are assigned.</p>
                <p>The future sequence could be:</p>
                <p className="rounded-md bg-zinc-100 p-4 font-medium text-zinc-950">Age, gender and location → trait probabilities → buy and spend eagerness → purchasing behaviour</p>
                <p>Product preferences could form another independent behavioural layer:</p>
                <p className="rounded-md bg-zinc-100 p-4 font-medium text-zinc-950">Customer traits → purchase frequency, spending amount and product or category preferences</p>
                <p>These additions would increase the realism of the synthetic economy without replacing the core selection, purchasing and order-placement workflow.</p>
              </div>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}
