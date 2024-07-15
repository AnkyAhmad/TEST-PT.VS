<script>
import MasterCustomer from "../json/MasterCustomer.json";
import MasterPayment from "../json/MasterPayment.json";
import MasterProduct from "../json/MasterProduct.json";
import formatCurrency from "~/utils/formatCurrency";
import calculateDiscountAndPrice from "~/utils/CalculateDiscount";
</script>

<template>
  <div>
    <div class="bg-emerald-500">
      <div
        class="container flex justify-center items-center py-5 px-2 lg:px-0 text-white"
      >
        <v-icon icon="mdi-leaf" size="30"></v-icon>
        <div class="font-bold text-lg">Natural Farm</div>
      </div>
    </div>

    <v-tabs v-model="tab" class="bg-emerald-500">
      <div class="container">
        <v-tab value="home">HOME</v-tab>
        <v-tab value="order">ORDER</v-tab>
      </div>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="home">
        <div class="container max-h-[300] my-10 p-3">
          <apexchart :options="options" :series="series" />
        </div>
      </v-tabs-window-item>

      <v-tabs-window-item value="order" class="p-5">
        <div class="container">
          <label class="text-black font-bold text-lg">
            Customer
            <v-select
              class="mb-3"
              density="compact"
              :items="customerSelects"
              v-model="selectedCustomer"
              variant="outlined"
              hide-details="auto"
            />
          </label>
          <label class="text-black font-bold text-lg">
            Produk
            <v-select
              class="mb-3"
              density="compact"
              clearable
              multiple
              :item-props="true"
              :items="productSelects"
              v-model="selectedProduk"
              variant="outlined"
              hide-details="auto"
            />
          </label>
          <div class="text-black font-bold text-lg">Detail Produk</div>

          <div v-if="selectedProduk.length > 0" class="mb-5">
            <div class="lg:grid lg:grid-cols-4 lg:gap-5">
              <div
                v-for="(produk, index) in order.produks"
                :key="index"
                class="w-full h-full rounded-md p-3 border-emerald-500 border-[1px] mb-2 min-h-40"
              >
                <div class="text-gray-950 font-medium">
                  {{ produk.name }}
                </div>
                <div class="text-gray-950 text-base">
                  {{ formatCurrency(produk.price) }}
                </div>
                <div class="flex gap-2 mt-2">
                  <v-text-field
                    class="w-full"
                    hide-details="auto"
                    label="Quantity"
                    type="number"
                    variant="outlined"
                    density="compact"
                    name="quantity"
                    v-model="produk.quantity"
                  />
                  <v-text-field
                    class="w-full"
                    hide-details="auto"
                    label="Discount Produk"
                    type="number"
                    variant="outlined"
                    density="compact"
                    name="discount"
                    append-inner-icon="mdi-percent-box"
                    v-model="produk.discount"
                    max="100"
                    oninput="if(Number(this.value) > Number(this.max)) this.value = this.max;"
                  />
                </div>
                <div class="flex justify-end items-center mt-2">
                  <v-btn
                    class="w-fit h-full text-red"
                    rounded="sm"
                    density="compact"
                    variant="tonal"
                    icon="mdi-delete"
                    @click="() => removeDetailProduct(produk.sku)"
                  />
                </div>
              </div>
            </div>
            <v-btn
              class="w-full md:mt-2"
              color="blue"
              variant="flat"
              @click="() => updateDetailsProduct()"
            >
              Apply Discount Product
            </v-btn>
          </div>
          <div v-else>
            <div
              class="w-full h-full rounded-md p-3 border-emerald-500 border-[1px] mb-2 min-h-40 text-center text-slate-400"
            >
              Belum Memilih Produk
            </div>
          </div>

          <label class="text-black font-bold text-lg">
            Payment
            <v-select
              class="mb-3"
              :items="paymentSelects"
              v-model="order.payment"
              variant="outlined"
              density="compact"
              hide-details="auto"
            />
          </label>
          <div class="flex items-center gap-2">
            <v-text-field
              class="w-full"
              hide-details="auto"
              label="Discount Order"
              type="number"
              variant="outlined"
              density="compact"
              name="discount_order"
              append-inner-icon="mdi-ticket-percent"
              v-model="order.discount_order"
            />
            <v-btn
              height="40"
              color="blue"
              density="compact"
              @click="handleVoucherOrder()"
            >
              apply
            </v-btn>
          </div>
          <div class="lg:flex lg:gap-2">
            <div class="w-full h-full min-h-60 my-5 bg-slate-200">
              <label class="text-black font-bold text-lg ml-2">
                LIST PRODUCTS
              </label>
              <div v-if="order.produks.length > 0">
                <div
                  v-for="(produk, index) in order.produks"
                  :key="index"
                  class="flex p-4"
                >
                  <div class="w-full flex flex-col">
                    <div class="line-clamp-2 text-base font-medium">
                      {{ produk.name }}
                    </div>
                    <div class="line-clamp-2">
                      {{ produk.quantity }}
                    </div>
                  </div>
                  <div class="w-1/2 flex flex-col items-end">
                    <div class="line-through decoration-red-700">
                      {{ formatCurrency(produk.price) }}
                    </div>
                    <div class="">
                      {{ formatCurrency(produk.fix_price ?? produk.price) }}
                    </div>
                  </div>
                </div>
                <div class="w-full h-1 bg-gray-700"></div>
                <div class="p-4">
                  <div class="flex justify-end">
                    <div class="w-full">SubTotal</div>

                    {{ formatCurrency(subTotal) }}
                  </div>
                  <div class="flex justify-end">
                    <div class="w-full">Discount Order</div>
                    {{ formatCurrency(order.discount_amount) }}
                  </div>
                </div>
                <div class="w-full h-1 bg-gray-700"></div>
                <div class="flex justify-end p-4">
                  <div class="w-full">Total</div>
                  {{ formatCurrency(totalComputed) }}
                </div>
              </div>
            </div>

            <div class="w-full h-full min-h-60 my-5 bg-slate-200">
              <label class="text-black font-bold text-lg ml-2"
                >INFO CUSTOMER</label
              >
              <div v-if="order.customer" class="p-4">
                <div class="text-slate-900 text-lg uppercase">
                  {{ order.customer_name }}
                </div>
                <div class="text-slate-900">
                  {{ order.customer?.email }}
                </div>
                <div class="text-slate-900">
                  {{ order.customer?.phone }}
                </div>
                <div class="text-slate-900 font-bold text-sm mt-[15px]">
                  Address
                </div>
                <p class="text-slate-900">
                  {{ order.customer?.address }}
                </p>
              </div>
            </div>
          </div>
          <v-btn
            class="w-full"
            height="40"
            color="blue"
            density="compact"
            :loading="loading"
            @click="handleSubmit()"
          >
            SUBMIT ORDER
            <template v-slot:loader>
              <v-progress-linear indeterminate></v-progress-linear>
            </template>
          </v-btn>
          <div v-if="submited === true">
            {{ order }}
          </div>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";

const tab = ref("order");
const selectedCustomer = ref(null);
const selectedProduk = ref([]);
const order = ref({
  customer_name: "",
  payment: "",
  discount_order: "",
  discount_amount: 0,
  produks: [],
  sub_total: 0,
  total: 0,
});
const customer = ref([]);
const payment = ref([]);
const product = ref([]);
const loading = ref(false);
const submited = ref(false);

const options = {
  chart: {
    width: "100%",
    height: "auto",
    type: "bar",
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ["Januari", "Februari", "Maret", "April", "Mei", "Juni"],
  },
};

const series = ref([
  {
    name: "produk-1",
    data: [251437000, 469456000, 754631000, 444912000, 159987000, 387547000],
  },
]);

const customerSelects = computed(() => {
  return customer.value.map((c) => ({
    title: c.label,
    value: c.email,
    subtitle: c.phone,
  }));
});

const productSelects = computed(() => {
  return product.value.map((c) => ({
    title: c.name,
    value: c.sku,
    subtitle: `Harga : ${formatCurrency(c.price)}`,
  }));
});

const paymentSelects = computed(() => {
  return payment.value.map((c) => ({
    title: c.name,
    value: c.code_payment,
  }));
});

const subTotal = computed(() => {
  const sub_total = order.value.produks.reduce((total, item) => {
    return total + Number(item.fix_price ?? item.price) * item.quantity;
  }, 0);

  order.value.sub_total = sub_total;
  return sub_total;
});

const totalComputed = computed(() => {
  let total = Number(order.value.sub_total - order.value.discount_amount);

  if (total < 0) {
    total = 0;
  }

  order.value.total = total;
  return total;
});

const removeDetailProduct = (sku) => {
  const filteredProduks = order.value.produks.filter(
    (item) => !sku.includes(item)
  );

  const filterSelectedDelete = selectedProduk.value.filter(
    (item) => !sku.includes(item)
  );

  selectedProduk.value = filterSelectedDelete;
  order.value.produks = filteredProduks;
};

const updateDetailsProduct = () => {
  const newDataProduks = order.value.produks.map((item) => {
    if (item.discount > 100) {
      item.discount = 100;
    } else if (!item.discount) {
      item.discount = 0;
    }

    return {
      ...item,
      quantity: item.quantity,
      fix_price: calculateDiscountAndPrice(item.price, item.discount)
        .priceAfterDiscount,
    };
  });

  order.value.produks = newDataProduks;
};

const handleVoucherOrder = () => {
  const discountTotal = calculateDiscountAndPrice(
    order.value.sub_total,
    order.value.discount_order
  ).discountAmount;

  order.value.discount_amount = discountTotal;
  order.value.total = Number(order.value.sub_total - discountTotal);
};

const handleSubmit = () => {
  loading.value = true;

  setTimeout(() => {
    loading.value = !loading.value;

    if (submited.value === false) {
      submited.value = !submited.value;
    }
  }, 2000);
};

watch(
  [selectedCustomer, selectedProduk],
  ([newCustomer, newProduk], [prevA, prevB]) => {
    if (newCustomer !== prevA) {
      const filteredObjects = customer.value.find(
        (item) => newCustomer === item.email
      );

      const custumer_name = filteredObjects.customer_name;
      const customerObj = filteredObjects;

      order.value = {
        ...order.value,
        customer: customerObj,
        customer_name: custumer_name,
      };
    }

    if (newProduk !== prevB) {
      const filteredObjects = product.value.filter((item) =>
        newProduk.includes(item.sku)
      );

      const produks = filteredObjects.map((item) => {
        return {
          ...item,
          quantity: 1,
          discount: 0,
        };
      });

      order.value = {
        ...order.value,
        produks,
      };
    }
  }
);

onMounted(() => {
  customer.value = MasterCustomer.data;
  payment.value = MasterPayment;
  product.value = MasterProduct;
});
</script>
