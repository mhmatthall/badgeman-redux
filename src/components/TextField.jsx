import style from "./TextField.module.scss";

export default function TextField({ label, placeholderText, supportingText }) {
  return (
    <div className={style.container}>
      <div className={style.field}>
        <div className={style.fieldArea}>
          <div className={style.contentArea}>
            <div className={style.labelArea}>
              <label htmlFor="code" className={style.label}>
                {label}
              </label>
            </div>
            <input
              type="text"
              id="code"
              autoFocus
              required
              maxLength={4}
              pattern="^[0-9a-fA-F]{4}$"
              placeholder={placeholderText}
              className={style.input}
            />
          </div>
        </div>
      </div>
      {supportingText && (
        <div className={style.supportingText}>{supportingText}</div>
      )}
    </div>
  );
}
