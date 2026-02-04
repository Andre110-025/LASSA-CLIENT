<script setup>
    const handler = window.CredoWidget.setup({
  key: payData.value.additionalInfoCredo,
  email: userDetails.userInfo.email,
  amount: amount * 100,
  currency: "NGN",
  renderSize: 0,
  reference: transRef,
  splitConfiguration: payData.value.split_settlement,
  metadata: {
    paymentFor: "Application Fee",
    paymentId: props.paymentID,
    appType: adsType(),
    appPurpose: props.appPurpose,
    amountPaid: payData.value.total_price,
  },
  callbackUrl: "https://merchant-test-line.netlify.app/successful",

  onClose: () => {
    loading.value = false;
    toast.error("Payment Cancelled", {
      position: toast.POSITION.TOP_CENTER,
    });
  },

  callBack: (response) => {
    setTimeout(() => emit("confirm"), 15000);
    toast.success("Payment Successful", {
      position: toast.POSITION.TOP_CENTER,
    });
  },
});

handler.openIframe();
</script>
