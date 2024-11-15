import{ap as L,r as v,o as B,aj as R,aq as T,ar as f,as as O,j as s,B as j,a1 as w,X as _,a2 as q,K as C,I as F,T as S,W as A,ao as l,am as N,an as $,at as D,au as W,H as G,q as H}from"./index-BguL6ZKh.js";import{L as M}from"./LoadingButton-QOuSFSJb.js";function V(){const u=L(),[c,y]=v.useState(!1),{isLoading:b}=B(t=>t.loader),r=R(),I=T().shape({email_address:f().email("Enter a valid email address").required("Email address is required"),password:f().min(8,"Minimum of 8 characters required").required("Password is required")}),P=O({initialValues:{email_address:"",password:""},validationSchema:I,onSubmit:async t=>{try{r(l(!0));const d={email_address:t.email_address,password:t.password},h=N.login(d);console.log("RESPONSE ON LOGIN :: ",h),$.promise(h,{pending:{render(){return"Loading. Please wait..."},icon:!1},success:{render({data:e}){var o,n,i;console.log("SUCCESS :: ",e),r(l(!1)),localStorage.setItem("accessToken",(o=e==null?void 0:e.data)==null?void 0:o.accessToken),r(D(!0)),r(W((n=e==null?void 0:e.data)==null?void 0:n.user));const x=((i=e==null?void 0:e.data)==null?void 0:i.message)||"Logged in successfully";return u.push("/dashboard"),`${x}`}},error:{render({data:e}){var o,n,i,g;return r(l(!1)),console.log("ERRO ON TOAST HERE :: ",(n=(o=e==null?void 0:e.response)==null?void 0:o.data)==null?void 0:n.message),`${(((g=(i=e==null?void 0:e.response)==null?void 0:i.data)==null?void 0:g.message)||(e==null?void 0:e.message)||"")??"An error occurred!"}`}}})}catch(d){console.log("ERROR :: ",d),r(l(!1))}}}),{errors:a,touched:m,getFieldProps:p,handleSubmit:E}=P,k=s.jsxs(j,{display:"flex",flexDirection:"column",alignItems:"flex-end",children:[s.jsx(w,{fullWidth:!0,label:"Email address",...p("email_address"),error:!!(m.email_address&&a.email_address),helperText:a.email_address,InputLabelProps:{shrink:!0},sx:{mb:3}}),s.jsx(_,{variant:"text",color:"inherit",style:{marginBottom:6},onClick:()=>u.push("/forgot-password"),children:"Forgot password?"}),s.jsx(w,{fullWidth:!0,label:"Password",InputLabelProps:{shrink:!0},type:c?"text":"password",InputProps:{endAdornment:s.jsx(q,{position:"end",children:s.jsx(C,{onClick:()=>y(!c),edge:"end",children:s.jsx(F,{icon:c?"solar:eye-bold":"solar:eye-closed-bold"})})})},...p("password"),error:!!(m.password&&a.password),helperText:a.password,sx:{mb:3}}),s.jsx(M,{fullWidth:!0,size:"large",type:"submit",color:"inherit",variant:"contained",disabled:b,onClick:()=>E(),children:"Sign in"})]});return s.jsxs("div",{children:[s.jsxs(j,{gap:1.5,display:"flex",flexDirection:"column",alignItems:"center",sx:{mb:5},justifyContent:"center",height:"100%",children:[s.jsx(S,{variant:"h5",children:"Sign in"}),s.jsxs(S,{variant:"body2",color:"text.secondary",children:["Don’t have an account?",s.jsx(A,{variant:"subtitle2",sx:{ml:.5},children:"Get started"})]})]}),k]})}function U(){return s.jsxs(s.Fragment,{children:[s.jsx(G,{children:s.jsxs("title",{children:[" ",`Sign in - ${H.appName}`]})}),s.jsx(V,{})]})}export{U as default};
