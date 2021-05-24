import React from 'react';
import { Upload } from '@progress/kendo-react-upload';
import url from '../services/getPresignedUrl';


function HomeUpload() {
  return(
    <div>
      <Upload 
        batch={false}
        restrictions={{
          allowExtensions: [".mov"],
          maxFileSize: 10000000
        }}
        defaultFiles={[]} 
        withCredentials={true}
        autoUpload={false}
        showActionButtons={true}
        // saveHeaders={'Access-Control-Allow-Origin'}
        saveUrl={url}
        // saveUrl={'https://demos.telerik.com/kendo-ui/service-v4/upload/save'}
        // removeUrl={'https://demos.telerik.com/kendo-ui/service-v4/upload/remove'} 
        removeUrl={url}
        
      />
    </div>
  );
    
}               

export default HomeUpload;

