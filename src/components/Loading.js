import './Loading.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Loader from 'react-loader-spinner'

function Loading({ text }) {
  return (
    <div className="loading">
      <Loader
         type='Oval'
         color="black"
         height={70}
         width={70}
      />
      {text}
    </div>
  );
}

export default Loading;
