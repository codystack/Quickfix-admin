import{ap as v,aj as F,av as N,r as P,o as $,aq as D,ar as g,aw as M,as as W,j as s,B as t,a1 as j,a2 as y,K as S,I as b,T as R,ao as i,am as H,an as _,H as V,q as z}from"./index-BguL6ZKh.js";import{L as G}from"./LoadingButton-QOuSFSJb.js";function K(){const E=v(),o=F(),I=N(),[d,O]=P.useState(!1),[c,q]=P.useState(!1),{isLoading:A}=$(a=>a.loader),{emailAddress:B}=I.state,C=D().shape({password:g().min(8,"Minimum of 8 characters required").required("Password is required"),confirmPassword:g().oneOf([M("password")],"Passwords must match").min(8,"Minimum of 8 characters required").required("Password is required")}),L=W({initialValues:{confirmPassword:"",password:""},validationSchema:C,onSubmit:async a=>{try{o(i(!0));const l={email_address:B,new_password:a.password,confirm_password:a.confirmPassword},m=H.resetPassword(l);console.log("RESPONSE ON RESET PASSWORD :: ",m),_.promise(m,{pending:{render(){return"Loading. Please wait..."},icon:!1},success:{render({data:e}){var r;console.log("SUCCESS :: ",e),o(i(!1));const w=((r=e==null?void 0:e.data)==null?void 0:r.message)||"Password updated successfully";return E.push("/"),`${w}`}},error:{render({data:e}){var r,h,x,f;return o(i(!1)),console.log("ERRO ON TOAST HERE :: ",(h=(r=e==null?void 0:e.response)==null?void 0:r.data)==null?void 0:h.message),`${(((f=(x=e==null?void 0:e.response)==null?void 0:x.data)==null?void 0:f.message)||(e==null?void 0:e.message)||"")??"An error occurred!"}`}}})}catch(l){console.log("ERROR :: ",l),o(i(!1))}}}),{errors:n,touched:u,getFieldProps:p,handleSubmit:T}=L,k=s.jsxs(t,{display:"flex",flexDirection:"column",alignItems:"flex-end",children:[s.jsx(j,{fullWidth:!0,label:"Password",InputLabelProps:{shrink:!0},type:d?"text":"password",InputProps:{endAdornment:s.jsx(y,{position:"end",children:s.jsx(S,{onClick:()=>O(!d),edge:"end",children:s.jsx(b,{icon:d?"solar:eye-bold":"solar:eye-closed-bold"})})})},...p("password"),error:!!(u.password&&n.password),helperText:n.password,sx:{mb:3}}),s.jsx(t,{p:1}),s.jsx(j,{fullWidth:!0,label:"Confirm Password",InputLabelProps:{shrink:!0},type:c?"text":"password",InputProps:{endAdornment:s.jsx(y,{position:"end",children:s.jsx(S,{onClick:()=>q(!c),edge:"end",children:s.jsx(b,{icon:c?"solar:eye-bold":"solar:eye-closed-bold"})})})},...p("confirmPassword"),error:!!(u.confirmPassword&&n.confirmPassword),helperText:n.confirmPassword,sx:{mb:3}}),s.jsx(G,{fullWidth:!0,size:"large",type:"submit",color:"inherit",variant:"contained",disabled:A,onClick:()=>T(),children:"Reset Password"})]});return s.jsxs("div",{children:[s.jsxs(t,{gap:1.5,display:"flex",flexDirection:"column",alignItems:"center",sx:{mb:5},justifyContent:"center",height:"100%",children:[s.jsx(R,{variant:"h5",children:"Set New Password"}),s.jsx(R,{variant:"body2",color:"text.secondary",gutterBottom:!0,children:"Enter your new password to continue"})]}),s.jsx(t,{p:1}),k]})}function Q(){return s.jsxs(s.Fragment,{children:[s.jsx(V,{children:s.jsxs("title",{children:[" ",`Reset Password - ${z.appName}`]})}),s.jsx(K,{})]})}export{Q as default};
