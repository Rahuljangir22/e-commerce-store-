import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * 404 route: clear status code, title, explanation, and navigation recovery.
 */
function NotFound({ errorCode, title, detail }) {
  return (
    <section className="not-found" role="alert">
      <p className="not-found__code" aria-hidden="true">
        {errorCode}
      </p>
      <h1 className="not-found__title">{title}</h1>
      <p className="not-found__detail">{detail}</p>
      <Link to="/" className="btn btn--primary">
        Back to home
      </Link>
    </section>
  );
}

NotFound.propTypes = {
  errorCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
};

export default NotFound;
