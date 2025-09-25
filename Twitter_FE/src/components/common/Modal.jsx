const Modal = ({ id, title, children, footer }) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box border rounded-md border-gray-700 shadow-md">
        {title && <h3 className="font-bold text-lg my-3">{title}</h3>}
        <div className="modal-content">{children}</div>
        {footer && <div className="modal-footer mt-4">{footer}</div>}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="outline-none">close</button>
      </form>
    </dialog>
  );
};

export default Modal;
