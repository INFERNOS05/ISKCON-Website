# 🧪 Custom SIP Donation Testing Guide

## ✅ Mock Test Results

**ALL TESTS PASSED! (11/11)** 🎉

The mock tests verified that the custom SIP donation logic works correctly:

### Test Results Summary:

1. ✅ **Predefined Amounts (₹100, ₹200, ₹500, ₹1000)**
   - Uses cached Razorpay plan IDs
   - Fast performance (no API calls needed)
   - All 4 predefined amounts tested successfully

2. ✅ **Custom Amounts (₹350, ₹750, ₹1500)**
   - Dynamically creates new Razorpay plans
   - Successfully generates unique plan IDs
   - All custom amounts tested successfully

3. ✅ **Minimum Amount Validation (₹50)**
   - Accepts minimum amount of ₹50
   - Works correctly for boundary case

4. ✅ **Invalid Amount Rejection**
   - Correctly rejects amounts below ₹50
   - Correctly rejects zero amounts
   - Correctly rejects negative amounts

---

## 🌐 Manual Testing in Browser

To test the full functionality with the UI:

### Option 1: Testing Locally (Recommended)

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   - If it asks to link to Netlify, you can skip or link your project
   - Alternative: Use `npm run dev:simple` for a simpler dev server

2. **Open in browser:**
   - Navigate to `http://localhost:3000` (or the port shown in terminal)

3. **Test the donation form:**
   - Go to the Donate page
   - Look for the MultistepDonation component

4. **Test Cases to Try:**

   **A. Test Predefined SIP Amounts:**
   - [ ] Toggle "Monthly recurring donation (SIP)" switch ON
   - [ ] Click preset button: ₹100
   - [ ] Verify amount is selected
   - [ ] Fill donor details
   - [ ] Proceed to see if plan is fetched correctly
   - [ ] Repeat for ₹200, ₹500, ₹1000

   **B. Test Custom SIP Amounts:**
   - [ ] Toggle "Monthly recurring donation (SIP)" switch ON
   - [ ] Enter custom amount: ₹350 in the input field
   - [ ] Fill donor details
   - [ ] Proceed and verify it creates a new plan
   - [ ] Try other custom amounts: ₹750, ₹1500, ₹275

   **C. Test Minimum Validation:**
   - [ ] Toggle "Monthly recurring donation (SIP)" switch ON
   - [ ] Enter amount below minimum: ₹30
   - [ ] Verify validation error appears
   - [ ] Try ₹50 (minimum) - should work

   **D. Test One-Time Donations (Should still work):**
   - [ ] Toggle SIP switch OFF
   - [ ] Enter any custom amount
   - [ ] Verify one-time donation flow still works

---

## 🔍 What to Look For

### In the Browser Console:

When you test, open browser DevTools (F12) and watch for these logs:

**For Predefined Amounts:**
```
Finding plan ID for amount: ₹100
Edge Function returned plan ID: plan_Qh8r9nUPEt3Dbv for amount: ₹100
```

**For Custom Amounts:**
```
Finding plan ID for amount: ₹350
Creating new Razorpay plan for amount: ₹350
✅ Successfully created plan: plan_xxxxx
```

### In the Network Tab:

1. **Get Plan ID Request:**
   - URL: `/.netlify/functions/get-plan-id?amount=350`
   - Status: 200
   - Response should contain:
     ```json
     {
       "success": true,
       "planId": "plan_xxxxx",
       "amount": 350,
       "isCustom": true
     }
     ```

2. **Create Subscription Request:**
   - URL: `/.netlify/functions/create-subscription`
   - Method: POST
   - Should use the planId from previous call

---

## 🔧 Testing with Actual Razorpay API

### Prerequisites:

1. **Razorpay Account:**
   - Sign up at https://razorpay.com/
   - Get Test Mode credentials

2. **Environment Variables:**
   - Copy `.env.example` to `.env`
   - Add your credentials:
     ```
     RAZORPAY_KEY_ID=rzp_test_xxxxx
     RAZORPAY_KEY_SECRET=your_secret_key
     ```

3. **Run the Real API Test:**
   ```bash
   node test-custom-sip.cjs
   ```
   - This will create actual plans in your Razorpay test dashboard
   - You can view them at: https://dashboard.razorpay.com/app/subscriptions/plans

---

## 📊 Expected Behavior

### For Common Amounts (₹100, ₹200, ₹500, ₹1000):
- ⚡ **Fast response** (uses cached plan IDs)
- 🔄 No Razorpay API call to create plan
- ✅ Uses existing predefined plans

### For Custom Amounts (any amount ≥ ₹50):
- 🔧 **Creates new plan** via Razorpay API
- ⏱️ Slight delay (1-2 seconds) for plan creation
- ✅ Returns newly created plan ID
- 📝 Plan visible in Razorpay dashboard

### For Invalid Amounts:
- ❌ Amounts < ₹50 are rejected
- ❌ Zero and negative amounts are rejected
- ⚠️ Error message shown to user

---

## 🐛 Troubleshooting

### Issue: "Failed to get subscription plan"
- **Check:** Razorpay credentials in `.env`
- **Check:** Network connection
- **Check:** Console for detailed error message

### Issue: "Minimum SIP amount is ₹50"
- **Expected behavior** for amounts < ₹50
- **Solution:** Enter ₹50 or more

### Issue: Plan creation is slow
- **Normal** for custom amounts (API call required)
- **Optimization:** Common amounts use cached plans

### Issue: Netlify Functions not working locally
- **Try:** `npm run dev:simple` instead
- **Or:** Use the mock tests for logic verification

---

## ✨ Success Criteria

Your implementation is working correctly if:

- ✅ All 11 mock tests pass
- ✅ Predefined amounts (₹100-₹1000) work instantly
- ✅ Custom amounts create new plans successfully
- ✅ Validation rejects amounts below ₹50
- ✅ Both SIP and one-time donations work
- ✅ No errors in browser console
- ✅ Razorpay checkout opens successfully

---

## 📝 Additional Notes

### Files Modified:
1. `netlify/functions/get-plan-id.cjs` - Backend logic for plan creation
2. `src/components/MultistepDonation.tsx` - Removed validation restrictions
3. `src/components/DonationForm.tsx` - Added minimum amount validation
4. `src/lib/razorpay.ts` - Updated comments

### Key Features:
- ✨ Dynamic plan creation for any amount
- ⚡ Cached plans for common amounts
- 🛡️ Minimum amount validation (₹50)
- 🔄 Backward compatible with existing flows

---

## 🎯 Next Steps

1. **Run the mock test** (already done ✅)
2. **Test in browser** with UI (when server is running)
3. **Test with real Razorpay** (optional, for production readiness)
4. **Deploy to Netlify** (when ready)

---

**Status:** ✅ Ready for testing and deployment!
