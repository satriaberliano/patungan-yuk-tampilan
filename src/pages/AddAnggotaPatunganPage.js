import React from "react";
import { FiArrowRight } from "react-icons/fi";
import useInput from "../hooks/useInput";
import {db} from '../config/firebase-config';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import UrlParser from "../url-parser";
import LocaleContext from "../contexts/LocaleContext";
import swal from "sweetalert";

function AddAnggotaPatunganPage(){
  const [name, setName] = useInput('');
  const [money, setMoney ] = useInput(0);
  const url = UrlParser.parserActiveUrl();
  const { locale } = React.useContext(LocaleContext);

  const addNewAnggotaHandler = async (event) => {
    event.preventDefault();

    const patunganRef = doc(db, "patungan", url.id);
    const data = await getDoc(patunganRef);
    const newMember = {
      id: +new Date(),
      Name: name,
      Total: Number(money),
    }
    let membersData = data.data().Members;
    membersData.push(newMember);

    await updateDoc(patunganRef, {Members: membersData});
    swal({
      title: `${locale === 'id' ? 'Data anggota berhasil ditambahkan' : 'Member data added successfully'}`,
      icon: "success",
    });
  }

  return (
    <div className="add-anggota-patungan-page">
        <div className='add-patungan__add-user'>
          <div className='add-patungan__add-user__text'>
            <h2 tabIndex="0">{locale === 'id' ? 'Tambah Anggota' : 'Add Member'}</h2>
          </div>
          <form onSubmit={addNewAnggotaHandler}>
            <input className='input__action' type='text' placeholder={locale === 'id' ? 'Nama anggota' : 'Member name'} value={name} onChange={setName} required/>
            <span className="currencyinput">
              <p>Rp</p>
              <input className='input__action' type='number' placeholder={locale === 'id' ? 'Jumlah patungan' : 'Number of patungan'} value={money} onChange={setMoney} required/>
            </span>
            <div className='register__action'>
              <button className='action-submit' type='submit' title={locale === 'id' ? 'Tambah anggota' : 'Add member'} disabled={!name || !money}>
                <p>{locale === 'id' ? 'Tambah' : 'Add'}</p>
                <FiArrowRight />
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}


export default AddAnggotaPatunganPage;