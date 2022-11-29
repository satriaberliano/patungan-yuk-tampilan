import React from "react";
import LocaleContext from "../contexts/LocaleContext";
import NewKegiatanItem from "./NewKegiatanItem";

function NewKegiatanList({ kegiatan, onDelete }) {
  const { locale } = React.useContext(LocaleContext);

  return (
    <>
      {kegiatan.length === 0 ? (
        <p tabIndex="0" className='conditional-rendering'>{locale === 'id' ? 'Kegiatan kosong...' : 'Activity is empty...'}</p>
      ) : (
        <div className='new-kegiatan__list'>
          {kegiatan.map((kgt) => (
            <NewKegiatanItem key={kgt.id} {...kgt} id={kgt.id} onDelete={onDelete} />
          ))}
        </div>
      )}
    </>
  );
}

export default NewKegiatanList;
