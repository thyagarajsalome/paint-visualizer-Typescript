import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FooterNav } from "./components/FooterNav";
import { UploadPage } from "./pages/UploadPage";
import { ApplyPaintPage } from "./pages/ApplyPaintPage";
import { OutputPage } from "./pages/OutputPage";
import { MorePage } from "./pages/MorePage";

const AppLayout = () => {
  const location = useLocation();
  const showFooter = ["/", "/apply", "/more"].includes(location.pathname);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-gray-800 dark:text-gray-200">
      <div className={showFooter ? "pb-24" : ""}>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/apply" element={<ApplyPaintPage />} />
          <Route path="/output" element={<OutputPage />} />
          <Route path="/more" element={<MorePage />} />
        </Routes>
      </div>
      {showFooter && <FooterNav />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
