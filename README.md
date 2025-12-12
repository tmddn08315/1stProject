# 🛒 Pet E-commerce Front-end | Redux Toolkit 기반 상태 관리 구조

> **기술 스택:** React, Redux Toolkit, React Router v6
>
> **주요 역할:** 복잡한 쇼핑몰 비즈니스 로직의 Redux State 모듈화 및 데이터 흐름 설계
<br />

## 1. 🌟 프로젝트 개요 및 핵심 목표
<img width="600" height="400" alt="image" src="https://github.com/user-attachments/assets/db1156f6-c45f-4b17-a5ef-c20b4b6e4eab" />

본 프로젝트는 React 기반의 E-commerce 웹사이트 프론트엔드에서 발생하는 모든 비즈니스 로직을 **Redux Toolkit (RTK)**을 사용하여 중앙 집중적으로 관리하는 데 중점을 두었습니다.

**✅ 핵심 구현 목표:**

1.  **Redux Toolkit 도입:** `createSlice`를 활용하여 액션, 리듀서를 통합하고 보일러플레이트 코드를 최소화하여 효율적인 상태 관리를 학습하고 적용했습니다.
2.  **모듈화 및 관심사 분리:** 사용자 인증, 장바구니, 결제, 페이지네이션 등 기능별로 Slice를 분리하여 **높은 유지보수성**과 **명확한 책임**을 갖는 코드를 작성했습니다.
3.  **프론트엔드 비즈니스 로직 처리:** 장바구니의 중복 상품 수량 증가, 결제 대상 상품 분리 등 복잡한 프론트엔드 단의 비즈니스 로직을 **Store 레벨**에서 처리했습니다.

---

## 2. 🛠️ 상태 관리 모듈 (Redux Slices) 상세 분석

프로젝트는 총 6개의 핵심 Redux Slice로 구성되어 있으며, 각 모듈은 독립적인 데이터와 로직을 관리합니다.

### 2.1. 🔐 사용자 인증 및 세션 관리 (`authSlice`)

사용자 로그인 상태 및 정보를 관리하며, **클라이언트 측 세션 영속성** 로직을 포함합니다.

| 상태 (State) | 타입 | 상세 설명 |
| :--- | :--- | :--- |
| `isLogin` / `isLoggedIn` | `Boolean` | 현재 Redux Store에서 관리하는 로그인 상태입니다. |
| `isUser` | `Object` / `null` | 로그인 성공 시 저장되는 사용자 정보 객체입니다. |

**💡 구현 특징: 로컬 스토리지 기반 세션 유지**

* **`loginUserFn`**: 로그인 성공 시 **`localStorage`**에 로그인 상태 및 사용자 정보를 저장하여 **브라우저 재시작 시에도 상태가 유지**되도록 처리했습니다.
* **`logOutUserFn`**: Store 상태 초기화와 함께 `localStorage`의 인증 정보를 제거하여 세션을 안전하게 종료합니다.

### 2.2. 🛒 장바구니 및 결제 준비 (`cartSlice`)

사용자 경험에 직접적으로 연결되는 장바구니의 복잡한 로직을 관리합니다.

| 상태 (State) | 타입 | 상세 설명 |
| :--- | :--- | :--- |
| `items` | `Array<Object>` | **전체 장바구니 목록.** 각 객체는 **`checked`** 속성을 포함하여 부분 결제를 지원합니다. |
| `paymentItems` | `Array<Object>` | **결제 단계로 넘길 항목**만 분리 저장됩니다. |

**💡 구현 특징: 장바구니 중복 처리 및 결제 분리**

* **중복 상품 처리**: `addCart` 시 상품의 ID와 TITLE을 복합적으로 비교하여 **중복 상품이면 기존 항목의 `count`만 증가**시키는 로직을 구현했습니다.
* **결제 항목 분리**: `setPaymentItems`를 통해 장바구니 내에서 **선택된(checked) 항목**만 추출하여 결제 데이터로 전송함으로써, 장바구니와 결제 흐름을 분리했습니다.
* **비동기 확장성**: `createAsyncThunk`를 활용한 `asyncAdminCartsFetch`를 정의하여 비동기 데이터 로딩 구조를 확보했습니다.

### 2.3. 📃 UI 및 데이터 목록 관리 (`pagingSlice`, `orderSlice`, `productsSlice`)

| Slice | 주요 관리 상태 | 핵심 역할 |
| :--- | :--- | :--- |
| **`pagingSlice`** | `currentPage`, `itemsPerPage` | 목록형 데이터에 대한 **범용적인 페이지 이동 제어**를 담당합니다. 페이지 변경 시 **`window.scrollTo(0,0)`**을 호출하여 사용자 경험을 개선했습니다. |
| **`paymentSlice`** | `paymentData`, `totalRevenue` | 결제 기록 저장 및 `addPayment` 시 **`totalRevenue`를 누적**하여 매출 현황 집계 로직을 구현했습니다. |
| **`orderSlice`, `productsSlice`** | `data`, `isUpdate` | 관리자 페이지에서 사용하는 주문 및 상품 목록의 상태를 관리하며, `isUpdate` 플래그를 통해 **데이터 갱신 시점**을 제어합니다. |

---

## 3. 🗺️ 프론트엔드 아키텍처 및 라우팅 구조

`react-router-dom`의 **`Outlet`**을 활용한 중첩 라우팅 구조를 채택하여, 각 페이지 영역의 레이아웃과 컴포넌트를 분리했습니다.

* **레이아웃 분리**: `ShopLayout`, `AuthLayout`, `AdminLayout`을 정의하여 **사용자 영역과 관리자 영역의 UI 구조를 명확히 구분**했습니다.
* **코드 스플리팅 적용**: 모든 주요 컴포넌트에 **`React.lazy`**와 **`Suspense`**를 적용하여 **초기 로딩 시점의 성능 최적화**를 시도했습니다.
* **라우터 모듈화**: `toShopRouter()`, `toAdminRouter()` 등 라우트 정의를 기능별 함수로 분리하여 **메인 라우터 코드의 가독성**을 높였습니다.

---

## 4. 프로젝트 구현 영상

---

## 5. 🚀 성과 및 향후 계획

### 🎯 성과 (Achievements)

* **Redux Toolkit 활용 능력 입증**: `createSlice`를 기반으로 복잡한 쇼핑몰의 상태를 체계적이고 효율적으로 관리하는 **프론트엔드 상태 관리 역량**을 확보했습니다.
* **재사용 가능한 상태 로직 구현**: 페이지네이션 등 범용 로직을 독립적인 Slice로 분리하여 **컴포넌트의 재사용성**을 높이고, 데이터 로직과 UI 로직을 분리하는 개발 원칙을 적용했습니다.

### 🚧 향후 계획 (Future Plans)

* **보안 강화**: 현재 `localStorage` 기반의 간단한 인증 체크를, **JWT 토큰을 활용한 역할(Role) 기반의 서버-사이드 연동 검증**으로 전환하여 관리자 페이지 접근 보안을 강화할 예정입니다.
* **Redux Persist 도입**: `cartSlice`와 같이 영속성이 필요한 상태에 대해 **`redux-persist`**를 도입하여 수동적인 `localStorage` 관리를 자동화하고 데이터 안정성을 높일 예정입니다.
