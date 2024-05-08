import styled from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import TitleHeader from '../components/Header/TitleHeader';
import BirthModal from '../components/Modal/Birth2';
import Swal from 'sweetalert2';
import AddressModal from '../components/Modal/Address';
import Toggle from '../components/Toggle';
import { myPagaApis } from '../api/apis/myPagaApis';
import { useCookies } from 'react-cookie';
import { medicineApis } from '../api/apis/medicineApis';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import './my-page.css';
import AddMedicine from '../components/MyPage/AddMedicine';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { handleToggle, useAdjustInputWidth } from '../utils/handlemedicine';

const MyPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 48px 30px;
  gap: 32px;
`;

const MyPageContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProfileImg = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: url(${(props) => props.imgSrc}) no-repeat center/cover;
`;

const ProfileInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
`;

const UserName = styled.div`
  font-size: 30px;
`;

const AgeWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  gap: 4px;
`;

const AgeInfo = styled.div``;

const Divder = styled.div`
  width: 100%;
  height: 1px;
  background-color: #b4b4b4;
`;

const EditItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 4px;
  box-sizing: border-box;
  //border: 1px solid red;
  //overflow-y: scroll;
`;

const EditHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MedicineTitle = styled(EditHeader)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
const AddButton = styled.img`
  transition: transform 0.3s ease-in-out; // 부드러운 전환 효과
  transform: ${({ currentSlide }) =>
    currentSlide === 1 ? 'rotate(45deg)' : 'rotate(0deg)'};
`;

const EditTitle = styled.div`
  font-size: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  border-bottom: 4px solid var(--secondary-unselected-color);
  padding: 0 4px 8px 4px;
  width: 100%;
  box-sizing: border-box;
  font-size: 24px;
  color: var(--unselected-color);
`;

const DateWrapper = styled(InputWrapper)`
  justify-content: space-between;
`;

const EditInfo = styled.input`
  font-size: 24px;
  width: 100%;
  border: none;
  border-bottom: 4px solid var(--secondary-unselected-color);
  outline: none;
  padding: 4px 4px 8px 4px;
  ::placeholder {
    color: var(--unselected-color);
  }
  box-sizing: border-box;
`;

const MedicineWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto; // 스크롤바 수정 필요
  border: 2px solid var(--secondary-unselected-color);
  border-radius: 8px;
  padding: 12px 8px;
  box-sizing: border-box;
`;
const MedicineItem = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 25%;
  width: 100%;
  max-width: 100%;
  border-bottom: ${(props) =>
    props.isLastItem === true
      ? 'none'
      : '2px solid var(--secondary-unselected-color)'};
  padding-bottom: 20px;
  overflow-x: hidden;
`;

const MedicineInfo = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 12px;
`;

const MedicineHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MedicineName = styled.span`
  font-size: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  //padding-bottom: 4px;
  //border: 1px solid red;
  box-sizing: border-box;
`;

const ModifyWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const EditBtn = styled.span`
  color: var(--select-color);
  white-space: nowrap;
`;
const DeleteBtn = styled.span`
  color: var(--error-color);
  white-space: nowrap;
`;
const CompleteBtn = styled.span`
  color: var(--primary-color);
  white-space: nowrap;
`;
const CycleWrapper = styled.div`
  display: flex;
  align-self: flex-end;
  gap: 20px;
`;
const MedicineInputWrapper = styled.div`
  overflow-x: hidden;
`;
const EditName = styled.input`
  align-self: flex-start;
  width: 160px;
  font-size: 20px;
  border: none;
  outline: none;
  border-bottom: 4px solid var(--secondary-unselected-color);
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MyPage = () => {
  const [profileImgSrc, setProfileImgSrc] = useState(''); // 사용자 성별에 맞게
  const [genderImgSrc, setGenderImgSrc] = useState(''); // 사용자 성별에 맞게
  const [dateModalState, setDateModalState] = useState(false);
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState(''); // 나이 계산 필요
  const [dateValue, setDateValue] = useState('');
  const [numValue, setNumValue] = useState('');
  const [displayNumValue, setDisplayNumValue] = useState(''); // 사용자에게 보여지는 값 (하이픈 포함)
  const [editNum, setEditNum] = useState(false);
  const numRef = useRef('');
  const [addressModalState, setAddressModalState] = useState(false);
  const [addressValue, setAddressValue] = useState('');
  const [editDetailAddress, setEditDetailAddress] = useState(false);
  const [detailAddress, setDetailAddress] = useState('');

  // 약 수정 관련
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [newValue, setNewValue] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
  const [userInfo, setUserInfo] = useState({});

  // 약 추가

  const [medicineList, setMedicineList] = useState([]);
  const dummyMedicineList = [
    {
      id: 1,
      medicine: '타이레놀',
      cycle: [true, true, true],
    },
    {
      id: 2,
      medicine: '아스피린',
      cycle: [true, false, true],
    },
  ];
  const accessToken = cookies.accessToken;

  // 슬라이더
  const sliderRef = useRef();
  const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이더 페이지(인덱스) 상태
  const [hideAll, setHideAll] = useState(false); // 그 뭐야 그 그 그거 약품 추가 탭 없애기

  const navigate = useNavigate();

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };
  const handleNext = () => {
    sliderRef.current.slickNext();
  };
  const handleSlide = () => {
    if (currentSlide === 0) {
      handleNext();
      setHideAll(false);
    } else if (currentSlide === 1) {
      sliderRef.current.slickPrev();
    }
  };

  const settings = {
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => setCurrentSlide(next), // 다음 슬라이드 인덱스 업데이트
    arrows: false,
    // draggable: false,
    // swipe: false, // 모바일 스와이프 비활성화
    speed: 200, // 넘어가는 시간
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      applyInfo(userInfo);
    }
  }, [userInfo]);

  useEffect(() => {
    if (editingIndex !== null) {
      setEditingName(newValue[editingIndex].medicineName);
    }
  }, [editingIndex, medicineList]);

  useEffect(() => {
    if (medicineList) {
      setNewValue([...medicineList]);
    }
  }, [medicineList]);

  const getUserInfo = async () => {
    await myPagaApis.getInfo(accessToken).then((res) => {
      if (res.status === 200) {
        setUserInfo(res.data);
      }
    });
  };
  const applyInfo = (userInfo) => {
    setUserName(userInfo.name);
    setAddressValue(userInfo.address);
    setDetailAddress(userInfo.detailAddress);
    setNumValue(userInfo.phoneNumber);
    setDisplayNumValue(phoneAutoHyphen(userInfo.phoneNumber));
    setDateValue(userInfo.birthday);
    setUserAge(calculateAge(userInfo.birthday));
    setMedicineList(userInfo.medicineResponses);
    setNewValue(userInfo.medicineResponses);
  };

  const calculateAge = (birthdate) => {
    const birthday = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };
  const updateMedicine = async (id, data) => {
    await medicineApis.update(id, data, accessToken).then((res) => {
      if (res.status === 204) {
        // getMedicineList();
        Swal.fire({
          title: '약품 수정',
          text: '약품이 수정되었습니다.',
          confirmButtonText: '확인',
          icon: 'success',
        });
      }
    });
  };

  const updateBirthday = async (date) => {
    await myPagaApis
      .updateBirthday({ birthday: date }, accessToken)
      .then(async (res) => {
        if (res.status === 204) {
          await getUserInfo();
          setDateModalState(false);
        } else {
          Swal.fire({
            title: '생년월일 수정',
            text: '생년월일 수정에 실패했습니다. 잠시 후 다시 시도해주세요.',
            icon: 'warning',
            confirmButtonText: '확인',
          });
          return;
        }
      });
  };

  const handleDateFocus = () => {
    setDateModalState(true);
  };
  const handleDateBlur = () => {
    setDateModalState(false);
  };

  const formatDate = (dateString, type) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (type === 'format') {
      // 페이지에 보여지는 값
      return `${year}년 ${month}월 ${day}일`;
    } else if (type === 'update') {
      // api 호출에 사용되는 값
      const formattedMonth = month < 10 ? `0${month}` : month;
      const formattedDay = day < 10 ? `0${day}` : day;

      return `${year}-${formattedMonth}-${formattedDay}`; // 포맷에 맞게 문자열을 반환합니다.
    }
  };

  const saveBirth = async (date) => {
    await updateBirthday(formatDate(date, 'update'));
  };

  const updateNum = async () => {
    await myPagaApis
      .updateNumber({ phoneNumber: numValue }, accessToken)
      .then((res) => {
        if (res.status === 204) {
          setEditNum(false);
        } else {
          Swal.fire({
            title: '전화 번호',
            text: '전화번호 수정에 실패했습니다. 잠시 후 다시 시도해주세요.',
            type: 'warning',
            confirmButtonText: '확인',
          }).then((res) => {
            if (res.isConfirmed) {
              numRef.current.focus();
            }
          });
        }
      });
  };

  const saveEditNum = async () => {
    if (numValue.length > 11 || numValue.length < 9) {
      Swal.fire({
        title: '전화 번호',
        text: '올바른 전화번호를 입력해주세요.',
        type: 'warning',
        confirmButtonText: '확인',
      }).then((res) => {
        if (res.isConfirmed) {
          numRef.current.focus();
        }
      });
      return;
    } else {
      await updateNum();
    }
  };

  const phoneAutoHyphen = (phone) => {
    return phone
      ?.replace(/[^0-9]/g, '')
      ?.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
  };
  const handleNumChange = (e) => {
    const rawNumber = e.target.value.replace(/[^0-9]/g, '');
    const formattedNumber = phoneAutoHyphen(rawNumber);
    setNumValue(rawNumber);
    setDisplayNumValue(formattedNumber);
  };

  const handleAddressFocus = () => {
    setAddressModalState(true);
  };
  const handleAddressBlur = () => {
    setAddressModalState(false);
  };

  const handleDetailAddressChange = (e) => {
    setDetailAddress(e.target.value);
  };

  const updateAddress = async (address, detailAddress) => {
    await myPagaApis
      .updateAddress(
        { address: address, detailAddress: detailAddress },
        accessToken,
      )
      .then(async (res) => {
        if (res.status === 204) {
          await getUserInfo();
        } else {
          Swal.fire({
            title: '주소 수정',
            text: '주소 수정에 실패했습니다. 잠시 후 다시 시도해주세요.',
            type: 'warning',
            confirmButtonText: '확인',
          });
        }
      });
  };

  const saveDetailAddress = async () => {
    await updateAddress(addressValue, detailAddress);
    setEditDetailAddress(false);
  };

  const saveAddress = async (address) => {
    await updateAddress(address, detailAddress);
  };

  // 약 수정

  const handleNameChange = (event) => {
    setEditingName(event.target.value);
  };

  const deleteBtn = (index, itemId) => {
    Swal.fire({
      title: '약품 삭제',
      text: `[${newValue[index].medicineName}] 을/를 삭제하시겠습니까 ?`,
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then((res) => {
      if (res.isConfirmed) {
        deleteItem(itemId);
      } else {
        return;
      }
    });
  };

  const deleteItem = async (index) => {
    await medicineApis
      .delete(index, accessToken)
      .then(async (res) => {
        if (res.status === 204) {
          Swal.fire({
            title: '약품 삭제',
            icon: 'success',
            text: '약품이 삭제되었습니다.',
            confirmButtonText: '확인',
          });

          const updateValue = [...newValue];
          updateValue.splice(index, 1);
          setNewValue(updateValue);
          setEditingIndex(null);

          await getUserInfo();
        }
      })
      .catch((error) => {
        if (error.response.data.code === 400) {
          Swal.fire({
            title: '약품 삭제',
            text: '약품 삭제에 실패했습니다.',
            confirmButtonText: '확인',
          }).then((res) => {
            if (res.isConfirmed) {
              return;
            }
          });
        }
      });
  };

  const saveBtn = () => {
    if (editingName.length < 3 || editingName.length > 20) {
      Swal.fire({
        title: '약품 이름',
        text: '약품 이름은 3자 이상 20자 이하로 입력해주세요.',
        confirmButtonText: '확인',
      }).then((res) => {
        if (res.isConfirmed) {
          return;
        }
      });
    } else {
      saveEdit();
    }
  };

  const saveEdit = async () => {
    // API 연결 시 -> 수정 사항 없는데 수정하려고 하면 400 에러 주의
    if (
      newValue[editingIndex].medicineName !== editingName ||
      !Object.is(
        newValue[editingIndex].medicineTime,
        medicineList[editingIndex].medicineTime,
      )
    ) {
      applyName();
      const data = {
        medicineName: editingName,
        medicineTime: newValue[editingIndex].medicineTime,
      };
      await updateMedicine(newValue[editingIndex].id, data);
      setEditingIndex(null);
    } else {
      // 수정사항 없음
      setEditingIndex(null);
    }
  };

  useAdjustInputWidth(editingName, editingIndex); // 이름 수정 시 input 너비 조절

  const applyName = () => {
    if (editingName) {
      const updatedValue = [...newValue];
      updatedValue[editingIndex].medicineName = editingName;
      setNewValue(updatedValue);
    }
  };

  const logOut = () => {
    Swal.fire({
      title: '로그아웃',
      text: '로그아웃 하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then((res) => {
      if (res.isConfirmed) {
        removeCookie('accessToken');
        Swal.fire({
          title: '로그아웃',
          icon: 'success',
          text: '로그아웃 되었습니다.',
          confirmButtonText: '확인',
        }).then((res) => {
          navigate('/');
        });
      } else {
        return;
      }
    });
  };

  return (
    <MyPageContainer>
      <TitleHeader title={'내 정보'} showBackButton={true} showDivider={true} />
      <MyPageContent>
        <ProfileWrapper>
          <ProfileImg
            imgSrc={
              process.env.PUBLIC_URL + 'images/MyPage/profile-user-male.svg'
            }
          />
          <ProfileInfoWrapper>
            <UserName>{userName}</UserName>
            <AgeWrapper>
              <AgeInfo>{userAge}세</AgeInfo>
              <img
                src={process.env.PUBLIC_URL + 'images/MyPage/gender-male.svg'}
              />
            </AgeWrapper>
          </ProfileInfoWrapper>
        </ProfileWrapper>
        <Divder />
        <EditItem>
          <EditTitle>생년월일</EditTitle>
          <DateWrapper onClick={handleDateFocus}>
            {formatDate(dateValue, 'format')}
            <img src={process.env.PUBLIC_URL + '/images/calendar.svg'} />
          </DateWrapper>
          <BirthModal
            isOpen={dateModalState}
            closeModal={handleDateBlur}
            birth={dateValue ? dateValue : new Date()}
            setBirth={setDateValue}
            formatDate={formatDate}
            saveBirth={saveBirth}
            defaultDate={dateValue}
          />
        </EditItem>
        <EditItem>
          <EditHeader>
            <EditTitle>전화번호</EditTitle>
            {editNum ? (
              <img
                src={process.env.PUBLIC_URL + 'images/MyPage/profile-save.svg'}
                onClick={() => saveEditNum()}
              />
            ) : (
              <img
                src={process.env.PUBLIC_URL + 'images/MyPage/profile-edit.svg'}
                onClick={() => setEditNum(true)}
              />
            )}
          </EditHeader>
          {editNum ? (
            <EditInfo
              type="text"
              value={displayNumValue}
              onChange={handleNumChange}
              ref={numRef}
            />
          ) : (
            <InputWrapper>{displayNumValue}</InputWrapper>
          )}
        </EditItem>
        <EditItem>
          <EditHeader>
            <EditTitle>주소</EditTitle>
            <img
              src={process.env.PUBLIC_URL + 'images/MyPage/profile-edit.svg'}
              onClick={handleAddressFocus}
            />
          </EditHeader>
          <InputWrapper>{addressValue}</InputWrapper>
          <AddressModal
            isOpen={addressModalState}
            closeModal={handleAddressBlur}
            address={addressValue}
            setAddress={setAddressValue}
            saveAddress={saveAddress}
          />
        </EditItem>
        <EditItem>
          <EditHeader>
            <EditTitle>상세주소</EditTitle>
            {editDetailAddress ? (
              <img
                src={process.env.PUBLIC_URL + 'images/MyPage/profile-save.svg'}
                onClick={() => saveDetailAddress()}
              />
            ) : (
              <img
                src={process.env.PUBLIC_URL + 'images/MyPage/profile-edit.svg'}
                onClick={() => setEditDetailAddress(true)}
              />
            )}
          </EditHeader>
          {editDetailAddress ? (
            <EditInfo
              type="text"
              value={detailAddress}
              onChange={handleDetailAddressChange}
            />
          ) : (
            <InputWrapper>{detailAddress}</InputWrapper>
          )}
        </EditItem>
        <EditItem>
          <MedicineTitle>
            <EditTitle>복용중인 약</EditTitle>
            <AddButton
              src={process.env.PUBLIC_URL + 'images/MyPage/add-medicine.svg'}
              onClick={() => handleSlide()}
              currentSlide={currentSlide} // 현재 슬라이드 인덱스를 prop으로 전달
            />
          </MedicineTitle>
          <Slider id="slider" ref={sliderRef} {...settings}>
            <MedicineWrapper>
              {newValue.map((item, index) => (
                <MedicineItem
                  key={item.id}
                  isLastItem={index === newValue.length - 1}
                >
                  <MedicineInfo id="medicine-info">
                    <MedicineHeader>
                      {editingIndex === index ? (
                        <MedicineInputWrapper>
                          <EditName
                            id="edit-name"
                            type="text"
                            value={editingName}
                            onChange={handleNameChange}
                          />
                        </MedicineInputWrapper>
                      ) : (
                        <MedicineName id="medicine-name">
                          {item.medicineName}
                        </MedicineName>
                      )}
                      <ModifyWrapper id="modify-wrapper">
                        {editingIndex === index ? (
                          <CompleteBtn
                            onClick={() => {
                              saveBtn();
                            }}
                          >
                            완료
                          </CompleteBtn>
                        ) : (
                          <EditBtn
                            onClick={() => {
                              setEditingIndex(index);
                            }}
                          >
                            수정
                          </EditBtn>
                        )}
                        <DeleteBtn
                          onClick={() => {
                            deleteBtn(index, item.id);
                          }}
                        >
                          삭제
                        </DeleteBtn>
                      </ModifyWrapper>
                    </MedicineHeader>
                    <CycleWrapper id="cycle-wrapper">
                      {['아침', '점심', '저녁'].map((part, cycleIndex) => (
                        <Toggle
                          key={`${index}-${cycleIndex}`}
                          text={part}
                          size="RectSmall"
                          selected={newValue[index].medicineTime.includes(part)}
                          onClick={() => {
                            setEditingIndex(index);
                            handleToggle(
                              index,
                              cycleIndex,
                              part,
                              newValue,
                              setNewValue,
                            );
                          }}
                        />
                      ))}
                    </CycleWrapper>
                  </MedicineInfo>
                </MedicineItem>
              ))}
            </MedicineWrapper>
            <AddMedicine
              getUserInfo={getUserInfo}
              handleSlide={handleSlide}
              hideAll={hideAll}
              setHideAll={setHideAll}
            />
          </Slider>
        </EditItem>
        <ButtonWrapper>
          <Button
            text="로그아웃"
            size="Large"
            height="Short"
            type="Secondary"
            onClick={logOut}
          />
        </ButtonWrapper>
      </MyPageContent>
    </MyPageContainer>
  );
};

export default MyPage;
