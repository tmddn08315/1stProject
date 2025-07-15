import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getMemberSelectorApi } from '../../../API/authAPI'
import { loginUserFn, logOutUserFn } from '../../../slices/authSlice';
import axios from 'axios';


const joinData = {
    userEmail: '',
    userPw: '',
    userName: '',
    age: '',
    address: '',
    role: 'ROLE_MEMBER'
}

const loginData = {
    userEmail: '',
    userPw: '',
}

const AuthJoin = () => {

    // let checkRolestate = useSelector((state) => { return state })
    const [login, setLogin] = useState(loginData)

    const dispatch = useDispatch()
    const containerRef = useRef(null);
    const Navigate = useNavigate()
    const [join, setjoin] = useState(joinData)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Login vaild Function
    const isLogin = useSelector(state => state.auth.isLogin)
    const isAuthenticated = isLogin || isLoggedIn;
    const storedUserLoggedInformation = localStorage.getItem("isLoggedIn")

    const loginHandler = (userEmail, userPw) => {
        localStorage.setItem("isLoggedIn", "1");
        //when login, Turn State >> True
        setIsLoggedIn(true)
        console.log(isLoggedIn)
    }
    const navi = () => {
        Navigate('/shop')
    }

    const onInputchangeFn = (e) => {
        const { name, value } = e.target;

        if (name === "loginEmail" || name === "loginPw") {
            setLogin(prev => ({ ...prev, [name === "loginEmail" ? "userEmail" : "userPw"]: value }));
        } else if (name === "joinEmail" || name === "joinPw" || name === "age" || name === "address" || name === "userName" || name === "role") {
            setjoin(prev => ({ ...prev, [name === "joinEmail" ? "userEmail" : name === "joinPw" ? "userPw" : name]: value }));
        }
    }


    const onLoginFn = ((e) => {
        e.preventDefault();
        const loginAxiosFn = async () => {
            try {
                alert(`로그인을 시도합니다...`)
                const resAPI = await getMemberSelectorApi()

                const num = resAPI.findIndex(el => {
                    return el.userEmail === login.userEmail && el.userPw === login.userPw
                })
                const isVal = resAPI.filter(el => {

                    return el.userEmail === login.userEmail && el.userPw === login.userPw
                })

                if (isVal.length > 0) {
                    alert(`로그인에 성공하였습니다`)
                    dispatch(loginUserFn(isVal[0]))
                    // Navigate('/shop')
                    loginHandler(num.userEmail, num.userPw)
                    console.log(loginData)

                } else {
                    alert(`이메일 또는 비밀번호가 일치하지 않습니다.`)
                }
            } catch (err) {
                alert(err)
            }
        }
        loginAxiosFn()
    })

    const onJoinFn = (e) => {
        e.preventDefault();
        const dataURL = `http://localhost:3001/members`

        if (!join.userEmail) {
            alert("이메일을 입력해 주세요.");
            return;
        }

        if (!join.userPw) {
            alert("비밀번호를 입력해 주세요.");
            return;
        }
        if (!join.userEmail || !join.userPw || !join.address || !join.age) {
            alert("입력한 정보가 유효하지 않습니다. 다시 확인해 주세요.");
            return;
        }
        const joinAxiosFn = async () => {
            try {
                alert(`회원가입을 신청합니다. 잠시만 기다려주세요...`)
                const resAPI = await getMemberSelectorApi()

                if (resAPI === null) {
                    alert('회원가입에 실패했습니다. 나중에 다시 시도해 주세요..')
                    return
                }
                // is Email Already Exist??
                const isEmailExist = resAPI.findIndex(el => {
                    return el.userEmail === join.userEmail
                }) // if no exist return -1 
                if (isEmailExist !== -1) {
                    alert(`이미 존재하는 이메일 입니다. 다른 이메일로 시도해주세요`)
                    return
                }

                // DB Primary KEY id 
                const maxId = resAPI.reduce((max, item) => {
                    const idNum = parseInt(item.id, 10);
                    return idNum > max ? idNum : max
                }, 0)

                const newId = { ...join, id: (maxId + 1).toString() }

                // axios> POST > JOINPage
                // after Join Move LoginPage
                const joinOK = await axios.post(`${dataURL}`, newId) //add account
                alert(`회원가입이 완료되었습니다. 로그인페이지로 이동합니다. `)
                Navigate(`/auth`)
            } catch (err) {
                alert(`회원가입에 실패하였습니다 :: ` + err)
            }
        }
        joinAxiosFn()
    }

    useEffect(() => {
        setLogin({ userEmail: '', userPw: '' });
        if (storedUserLoggedInformation === "1") {
            setIsLoggedIn(true);
            console.log(`YOU ARE ALREADY LOGGED IN`)
        }
        if (localStorage.getItem("isLoggedIn")) {
            // Navigate("/shop");

        }

        if (isLogin) {
            // alert(`이미 로그인이 되어있습니다, 이전 페이지로 이동합니다`)
            // Navigate(`/shop`)
        }
        const container = containerRef.current;
        if (container) {
            setTimeout(() => {
                container.classList.add('sign-in');
            }, 200);
        }
    }, [isLogin])

    const toggle = () => {
        const container = containerRef.current;
        if (container) {
            container.classList.toggle('sign-in');
            container.classList.toggle('sign-up');
        }
    };

    // const isLoginn = useSelector(state => state.auth.isLogin)
    const loginUser = useSelector(state => state.auth.isUser)

    useEffect(() => {
        console.log('shop 페이지 - 로그인 상태:', isLogin)
        console.log('shop 페이지 - 로그인 유저 정보:', loginUser)
    }, [isLogin, loginUser])

    return (
        <>

            {!isAuthenticated ? (
                <>
                    < div className="container" ref={containerRef} >
                        <div className="row">
                            <div className="col align-items-center flex-col sign-up">
                                <div className="form-wrapper align-items-center">
                                    <div className="form sign-up">
                                        <form>
                                            {/* 회원가입 */}
                                            <div className="input-group">
                                                <i className='bx bx-mail-send'></i>
                                                <input type="email" name="joinEmail" id="userEmail" placeholder='EMAIL'
                                                    value={join.userEmail} onChange={onInputchangeFn} />
                                            </div>
                                            <div className="input-group">
                                                <i className='bx bxs-lock-alt'></i>
                                                <input type="password" name="joinPw" id="userPw" placeholder='PASSWORD'
                                                    value={join.userPw} onChange={onInputchangeFn} />
                                            </div>
                                            <div className="input-group">
                                                <i className='bx bxs-lock-alt'></i>
                                                <input type="text" name="age" id="age" placeholder='AGE'
                                                    value={join.age} onChange={onInputchangeFn} />
                                            </div>
                                            <div className="input-group">
                                                <i className='bx bxs-lock-alt'></i>
                                                <input type="text" name="address" id="address" placeholder='ADDRESS'
                                                    value={join.address} onChange={onInputchangeFn} />
                                            </div>
                                            <div className="input-group">
                                                <i className='bx bxs-lock-alt'></i>
                                                <input type="text" name="userName" id="userName" placeholder='NAME'
                                                    value={join.userName} onChange={onInputchangeFn} />
                                            </div>

                                            <li>
                                                <label htmlFor="role">ROLE</label>
                                                <select name="role" id="role"
                                                    value={join.role} onChange={onInputchangeFn}>
                                                    <option value='ROLE_MEMBER' defaultValue>MEMBER</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>
                                            </li>

                                            <button onClick={onJoinFn}> Sign up </button>
                                            <p><span>Already have an account? </span>
                                                <b onClick={toggle} className="pointer">
                                                    Sign in here</b></p>
                                            {/* (!join.userEmail || !join.userPw || !join.userName || !join.age) */}
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className="col align-items-center flex-col sign-in">
                                <div className="form-wrapper align-items-center">
                                    <div className="form sign-in">
                                        <form>
                                            <div className="input-group">
                                                <i className='bx bxs-user'></i>
                                                <input type="email" name="loginEmail" id="userEmail" placeholder='EMAIL'
                                                    value={login.userEmail} onChange={onInputchangeFn} />
                                            </div>
                                            <div className="input-group">
                                                <i className='bx bxs-lock-alt'></i>
                                                <input type="password" name="loginPw" id="userPw" placeholder='PASSWORD'
                                                    value={login.userPw} onChange={onInputchangeFn} />
                                            </div>

                                            <button onClick={onLoginFn}> LOGIN</button>
                                            <p>
                                                <b>
                                                    Forgot password?
                                                </b>
                                            </p>
                                            <p>
                                                <span> Don't have an account?
                                                </span>
                                                <b onClick={toggle} className="pointer">
                                                    Sign up here
                                                </b>
                                            </p>
                                        </form>
                                    </div>

                                </div>
                                <div className="form-wrapper">
                                </div>
                            </div>
                        </div>
                        <div className="row content-row">
                            <div className="col align-items-center flex-col">
                                <div className="text sign-in">
                                    <h2>
                                        LOGIN
                                    </h2>

                                </div>
                                <div className="img sign-in">

                                </div>
                            </div>

                            <div className="col align-items-center flex-col">
                                <div className="img sign-up">

                                </div>
                                <div className="text sign-up">
                                    <h2>
                                        Sign Up
                                    </h2>

                                </div>
                            </div>
                        </div>
                    </div >
                </>
            ) : (
                <>
                    < div className="container" ref={containerRef} >
                        <div className="row">
                            <div className="col align-items-center flex-col sign-up">
                                <div className="form-wrapper align-items-center">
                                </div>
                            </div>
                            <div className="col align-items-center flex-col sign-in">
                                <div className="form-wrapper align-items-center">
                                    <div className="form sign-in">
                                        <form>
                                            <button className='logout-btn' onClick={navi}> SHOP</button>
                                            <button className='logout-btn' onClick={() => {
                                                dispatch(logOutUserFn());
                                                localStorage.removeItem("isLoggedIn");
                                                setIsLoggedIn(false);
                                                Navigate('/auth');  // 로그아웃 후 로그인 페이지로 이동
                                            }}> LOGOUT</button>
                                            <p> <span> Enjoy your Shopping !!</span> </p>
                                        </form>
                                    </div>

                                </div>
                                <div className="form-wrapper">
                                </div>

                            </div>
                        </div >
                        <div className="row content-row">
                            <div className="col align-items-center flex-col">
                                <div className="text sign-in">
                                    <h2>
                                        LOGIN
                                    </h2>
                                </div>
                                <div className="img sign-in">

                                </div>
                            </div>

                            <div className="col align-items-center flex-col">
                                <div className="img sign-up">

                                </div>
                                <div className="text sign-up">
                                    <h2>
                                        Sign Up
                                    </h2>

                                </div>
                            </div>
                        </div>
                    </div >
                </>
            )}
        </>
    );
};

export default AuthJoin