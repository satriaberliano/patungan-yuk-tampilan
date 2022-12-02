/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {db} from '../config/firebase-config';
import { collection, getDocs, query, where } from "firebase/firestore"
import { AddNewPatunganPath } from "../routes";
import { FiPlusSquare, FiLogOut } from 'react-icons/fi';
import { FaUsers, FaCoins } from 'react-icons/fa';
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { getUserName, getUserID, putAccessToken } from "../utils/helper";
import LocaleContext from "../contexts/LocaleContext";
import ApiSource from "../data/api-source";
import Loader from "../components/Loader";
import swal from "sweetalert";

function Home(){
  const [ currentUser, setCurrentUser ] = useState();
  const [ patungan, setPatungan ] = useState([]);
  const [ numbersPatungan, setNumbersPatungan ] = useState(0);
  const [ idUser, setIdUser ] = useState();
  const [ image, setImage ] = useState();
  const [ loading, setLoading ] = useState(true);
  const { locale } = React.useContext(LocaleContext);
  const navigate = useNavigate();

  const onLogoutHandler = () => {
    swal({
      title: `Logout`,
      text: `${locale === 'id' ? 'Apakah kamu yakin?' : 'Are you sure?'}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willLogout) => {
      if (willLogout) {
        swal({
          icon: 'success',
          title: `${locale === 'id' ? 'Logout berhasil' : 'Logout success'}`,
          buttons: false,
          timer: 1000,
        })
        .then(() => {
          signOut(auth)
          .then(() => {
            putAccessToken('');
            navigate('/info');
          });
        });
      }
    });
  }

  let patunganCollectionRef = query(collection(db, "patungan"), where("idUser", "==", null));
  
  const getPatungan = async () => {
    const data = await getDocs(patunganCollectionRef);
    setPatungan(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    setNumbersPatungan(data.docs.length);
    setLoading(false);
  }

  if (idUser !== undefined){
    patunganCollectionRef = query(collection(db, "patungan"), where("idUser", "==", idUser));
  } else {
    console.log(idUser)
  };

  useEffect(()=> { 
    async function images() {
      const result = await ApiSource.getImages();
      setImage(result);
    }   

    images();
    getUserID(setIdUser);
    getUserName(setCurrentUser);
    getPatungan();
  },[idUser]);
  
  return(
    <>
      {
        loading ?
        <Loader />
        :
        <section className="home">
          <section className="payu__dashboard">
            <div className="payu__dashboard-hero">
              <img className="payu__dashboard-image" src={image} alt="dashboard-images"></img>
              <div className="payu__dashboard-hero-content">
                <h2 tabIndex="0">{locale === 'id' ? `Hai ${currentUser}` : `Hi ${currentUser}`}!</h2>
                <p tabIndex="0">{locale === 'id' ? 'Selamat datang di dashboard patungan' : 'Welcome to patungan dashboard'}</p>
                <p tabIndex="0">{locale === 'id' ? `Kamu memiliki ${numbersPatungan} patungan` : `You have ${numbersPatungan} patungan`}</p>
              </div>
            </div>
            <div className="payu__dashboard-item">
              <div className='payu__dashboard-item__title'>
                <h3 tabIndex="0">{locale === 'id' ? 'Daftar Patungan' : 'Patungan List'}</h3>
              </div>
              <div className="payu__dashboard-item__button">
                <button type='button' aria-label='add new patungan'><Link to={`${AddNewPatunganPath}`}><FiPlusSquare /></Link></button>
                <button type='button' className="payu__dashboard-logout-button" aria-label='logout button' onClick={onLogoutHandler}><FiLogOut /></button>
              </div>
            </div>
          </section>
          {patungan.length === 0 ? (
            <p className='home-conditional-rendering'>{locale === 'id' ? 'Patungan kosong...' : 'Patungan is empty...'}</p>
          ) : (
            <section className="payu__list-patungan">
              {patungan.map((group) => {
                const balanceMembers = group.Members.map((member) => {
                  return member.Total
                })
                const sumBalance = balanceMembers.reduce((partialSum, a) => partialSum + a, 0);
                return <div className="list-wrapper" key={group.id} >
                        <Link to={`/detail-patungan/${group.id}`}>
                          <div className="payu__list-patungan-item">
                            <h3 className="payu__list-patungan-item__description">{group.title}</h3>
                            <section className="payu__list-patungan-item__text">
                              <p><FaUsers /> {group.Members.length} {locale === 'id' ? 'anggota' : 'members'}</p>
                              <p><FaCoins /> Rp {sumBalance}</p>
                            </section>
                          </div>
                        </Link>
                      </div>
              })}
            </section>
          )}
        </section>
      }
    </>
  )
};

export default Home;