'use client'

const Tracking = () => (
    <>
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
      window._mfq = window._mfq || [];
      (function() {
        var mf = document.createElement("script");
        mf.type = "text/javascript"; mf.defer = true;
        mf.src = "//cdn.mouseflow.com/projects/1f6e7291-948d-477f-924b-e082986560e1.js";
        document.getElementsByTagName("head")[0].appendChild(mf);
      })();
    ` }} />
    </>
);

export default Tracking;
