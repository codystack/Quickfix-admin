<<<<<<<< HEAD:dist/assets/forgot-password-Nb5m-zy7.js
import{ae as _,o as E,ad as F,aq as b,ar as v,as as R,j as s,B as l,W as T,T as w,aj as a,ah as L,ai as O,H as $,t as B}from"./index-DCSkPGta.js";import{L as C}from"./LoadingButton-CzdaYy2D.js";function I(){const g=_(),{isLoading:p}=E(r=>r.loader),i=F(),h=b().shape({email_address:v().email("Enter a valid email address").required("Email address is required")}),x=R({initialValues:{email_address:""},validationSchema:h,onSubmit:async r=>{try{i(a(!0));const n={email_address:r.email_address},S=L.forgotPassword(n);O.promise(S,{pending:{render(){return"Loading. Please wait..."},icon:!1},success:{render({data:e}){var o;console.log("SUCCESS :: ",e),i(a(!1));const d=((o=e==null?void 0:e.data)==null?void 0:o.message)||`OTP code successfully sent to ${r.email_address}`;return g("/verify-otp",{state:{emailAddress:r.email_address}}),`${d}`}},error:{render({data:e}){var o,c,m,u;return i(a(!1)),console.log("ERRO ON TOAST HERE :: ",(c=(o=e==null?void 0:e.response)==null?void 0:o.data)==null?void 0:c.message),`${(((u=(m=e==null?void 0:e.response)==null?void 0:m.data)==null?void 0:u.message)||(e==null?void 0:e.message)||"")??"An error occurred!"}`}}})}catch(n){console.log("ERROR :: ",n),i(a(!1))}}}),{errors:t,touched:f,getFieldProps:j,handleSubmit:y}=x,P=s.jsxs(l,{display:"flex",flexDirection:"column",alignItems:"flex-end",children:[s.jsx(T,{fullWidth:!0,label:"Email address",...j("email_address"),error:!!(f.email_address&&t.email_address),helperText:t.email_address,InputLabelProps:{shrink:!0},sx:{mb:3}}),s.jsx(l,{p:2}),s.jsx(C,{fullWidth:!0,size:"large",type:"submit",color:"inherit",variant:"contained",disabled:p,onClick:()=>y(),children:"Send"})]});return s.jsxs("div",{children:[s.jsx(l,{gap:1.5,display:"flex",flexDirection:"column",alignItems:"center",sx:{mb:5},justifyContent:"center",height:"100%",children:s.jsx(w,{variant:"h5",children:"Forgot Password"})}),P]})}function N(){return s.jsxs(s.Fragment,{children:[s.jsx($,{children:s.jsxs("title",{children:[" ",`Forgot Password - ${B.appName}`]})}),s.jsx(I,{})]})}export{N as default};
========
import{ae as _,o as E,ad as F,aq as b,ar as v,as as R,j as s,B as l,W as T,T as w,aj as a,ah as L,ai as O,H as $,t as B}from"./index-OkOCVtyy.js";import{L as C}from"./LoadingButton-D9LQN5bg.js";function I(){const g=_(),{isLoading:p}=E(r=>r.loader),i=F(),h=b().shape({email_address:v().email("Enter a valid email address").required("Email address is required")}),x=R({initialValues:{email_address:""},validationSchema:h,onSubmit:async r=>{try{i(a(!0));const n={email_address:r.email_address},S=L.forgotPassword(n);O.promise(S,{pending:{render(){return"Loading. Please wait..."},icon:!1},success:{render({data:e}){var o;console.log("SUCCESS :: ",e),i(a(!1));const d=((o=e==null?void 0:e.data)==null?void 0:o.message)||`OTP code successfully sent to ${r.email_address}`;return g("/verify-otp",{state:{emailAddress:r.email_address}}),`${d}`}},error:{render({data:e}){var o,c,m,u;return i(a(!1)),console.log("ERRO ON TOAST HERE :: ",(c=(o=e==null?void 0:e.response)==null?void 0:o.data)==null?void 0:c.message),`${(((u=(m=e==null?void 0:e.response)==null?void 0:m.data)==null?void 0:u.message)||(e==null?void 0:e.message)||"")??"An error occurred!"}`}}})}catch(n){console.log("ERROR :: ",n),i(a(!1))}}}),{errors:t,touched:f,getFieldProps:j,handleSubmit:y}=x,P=s.jsxs(l,{display:"flex",flexDirection:"column",alignItems:"flex-end",children:[s.jsx(T,{fullWidth:!0,label:"Email address",...j("email_address"),error:!!(f.email_address&&t.email_address),helperText:t.email_address,InputLabelProps:{shrink:!0},sx:{mb:3}}),s.jsx(l,{p:2}),s.jsx(C,{fullWidth:!0,size:"large",type:"submit",color:"inherit",variant:"contained",disabled:p,onClick:()=>y(),children:"Send"})]});return s.jsxs("div",{children:[s.jsx(l,{gap:1.5,display:"flex",flexDirection:"column",alignItems:"center",sx:{mb:5},justifyContent:"center",height:"100%",children:s.jsx(w,{variant:"h5",children:"Forgot Password"})}),P]})}function N(){return s.jsxs(s.Fragment,{children:[s.jsx($,{children:s.jsxs("title",{children:[" ",`Forgot Password - ${B.appName}`]})}),s.jsx(I,{})]})}export{N as default};
>>>>>>>> a0fe20fdbda92d9becfae0dbd0369ebfced26f8c:dist/assets/forgot-password-DYuBlGy1.js
