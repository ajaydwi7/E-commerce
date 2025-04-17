import SEO from "@/components/SEO/SEO";


const ErrorView = () => {
  return (
    <div style={{ height: "50vh" }} className="sub-container">
      <SEO
        title="Empty Cart || Snappeditt"
        noindex={true}
      />
      <h1>404</h1>
      <h4>Oops Page Not Found!</h4>
    </div>
  );
};
export default ErrorView;
