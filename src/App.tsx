import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { FilterProvider } from '@/contexts/FilterContext';
import { AdminFilterProvider } from '@/contexts/AdminFilterContext';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import Landing from '@/pages/marketing/Landing';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ContactForm } from '@/components/contact/ContactForm';
import { useContactDialog } from '@/hooks/useContactDialog';
import ProtectedRoute from '@/components/ProtectedRoute';
import SuperAdminRoute from '@/components/SuperAdminRoute';

function App() {
  const { isOpen, closeContactDialog } = useContactDialog();

  return (
    <Router>
      <AuthProvider>
        <FilterProvider>
          <AdminFilterProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Landing />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <SuperAdminRoute>
                    <Admin />
                  </SuperAdminRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Global Components */}
            {/* <ChatBot /> */}
            <Dialog open={isOpen} onOpenChange={closeContactDialog}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <ContactForm
                  formType="contact"
                  onSubmissionSuccess={closeContactDialog}
                />
              </DialogContent>
            </Dialog>
            <Toaster />
          </AdminFilterProvider>
        </FilterProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
