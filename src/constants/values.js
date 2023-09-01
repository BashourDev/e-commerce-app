import { dataError, noInternetError } from "../../assets/images";
import i18next from "../../i18n";
export const PRODUCT_SORT_VALUES = {
  POPULARITY: "Popularity",
  PRICE_LOW_TO_HIGH: "Price from Low to High",
  PRICE_HIGH_TO_LOW: "Price from High to Low",
};
export const PRODUCT_SORT_VALUES_ARABIC = {
  POPULARITY: "الشعبية",
  PRICE_LOW_TO_HIGH: "السعر من الأقل إلى الأعلى",
  PRICE_HIGH_TO_LOW: "السعر من الأعلى إلى الأقل",
};

export const ERRORS = {
  noInternet: {
    title: "No Internet Connection",
    message: "Please check your internet settings and try again later",
    image: noInternetError,
  },
  data: {
    title: "Something Went Wrong",
    message:
      "We encountered some error while processing your request. Please try again later",
    image: dataError,
  },
};
export const ERRORS_ARABIC = {
  noInternet: {
    title: "لا يوجد اتصال بالإنترنت",
    message: "يرجى التحقق من إعدادات الإنترنت لديك والمحاولة مرة أخرى لاحقًا",
    image: noInternetError,
  },
  data: {
    title: "حدث خطأ ما",
    message:
      "نواجه بعض الأخطاء أثناء معالجة طلبك. الرجاء معاودة المحاولة في وقت لاحق",
    image: dataError,
  },
};
