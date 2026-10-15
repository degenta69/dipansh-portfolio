/**
 * A slot for a future 3D portrait. It is a monogram, not a picture of a person.
 */
export default function PortraitSlot() {
  return (
    <figure className="portrait-slot">
      <div className="portrait-slot-frame" aria-hidden="true">
        <span className="portrait-slot-mark">DS</span>
      </div>
      <figcaption>
        Portrait pending. A 3D portrait will replace this placeholder.
      </figcaption>
    </figure>
  );
}
