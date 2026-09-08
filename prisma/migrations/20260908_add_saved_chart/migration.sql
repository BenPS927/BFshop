CREATE TABLE "saved_chart" (
    "id" SERIAL NOT NULL,
    "request" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_chart_pkey" PRIMARY KEY ("id")
);
