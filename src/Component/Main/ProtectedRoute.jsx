import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../assets/authservice';

const ProtectedRoute = ({ element, redirectTo }) => {
    if (isAuthenticated()) {
        return <Navigate to={redirectTo} replace />;
    }
    return element;
};
export default ProtectedRoute;