export function DossierLeft() {
  return (<>
    <p className="kicker">05 · Dossier · from the résumé</p>
    <h2 id="dos-h">The short file.</h2>
    <div className="dos-block">
      <h3>Education</h3>
      <div className="job-h"><div><h4>Institute of Technology and Science, Ghaziabad</h4><p>Bachelor of Computer Application (B.C.A)</p></div><time>Aug 2019 – Aug 2022</time></div>
      <div className="job-h"><div><h4>DAV Public School (CBSE), Ghaziabad</h4><p>Senior Secondary (XII), Commerce</p></div><time>2018 – 2019</time></div>
    </div>
    <div className="dos-block">
      <h3>Languages &amp; interests</h3>
      <p>English (professional), Hindi (native). Cooking, video games, swimming, chess.</p>
    </div>
  </>)
}
export function DossierRight() {
  return (<>
    <div className="dos-block">
      <h3>Projects</h3>
      <ul className="tick">
        <li><b>Monolith Lambda API template</b> (open source): reusable serverless API template in TypeScript with dependency injection, Prisma, AWS KMS and shell-script deploys.</li>
        <li><b>MongoDB wrapper</b>: custom data-access wrapper to simplify MongoDB operations.</li>
        <li><b>DiskGod</b>: Discord-style real-time chat (MongoDB, Express, React, Socket.io, Redux, Tailwind).</li>
        <li><b>NetFlex</b>: Netflix-style streaming UI (React, Firebase, TMDB API).</li>
        <li><b>Engage Music</b>: freelance e-commerce MVP for artists to sell albums (React, TypeScript, Material UI, Node/Express, MongoDB, Stripe, AWS EC2 + CodePipeline).</li>
        <li><b>QSI (Queer Spot India)</b>: global platform front end (React, Recoil, Google login, Razorpay).</li>
      </ul>
    </div>
    <a className="btn" href="#/resume">Open the full résumé →</a>
  </>)
}
