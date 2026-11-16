// 초성 퀴즈 문제와 도우미 함수.

export type Word = { answer: string; hint: string };
export type Category = { slug: string; name: string; words: Word[] };

const CHO = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

/** "김밥" → "ㄱㅂ". 한글 음절이 아닌 글자(공백 등)는 그대로 둔다. */
export function toChosung(text: string): string {
  return [...text]
    .map((ch) => {
      const code = ch.charCodeAt(0) - 0xac00;
      return code >= 0 && code <= 11171 ? CHO[Math.floor(code / 588)] : ch;
    })
    .join("");
}

/** 정답 비교용: 공백을 없앤다. */
export function normalize(text: string): string {
  return text.replace(/\s+/g, "").trim();
}

export const categories: Category[] = [
  {
    slug: "food",
    name: "음식",
    words: [
      { answer: "김밥", hint: "소풍 도시락의 대표, 김으로 돌돌 만 밥" },
      { answer: "떡볶이", hint: "빨간 고추장 소스에 떡과 어묵" },
      { answer: "비빔밥", hint: "나물과 고추장을 넣고 슥슥 섞어 먹는 밥" },
      { answer: "된장찌개", hint: "콩을 발효한 장으로 끓인 구수한 찌개" },
      { answer: "삼겹살", hint: "불판에 구워 쌈 싸 먹는 돼지고기" },
      { answer: "짜장면", hint: "이사하는 날 시켜 먹는 까만 면" },
      { answer: "냉면", hint: "여름에 시원하게, 물 또는 비빔" },
      { answer: "붕어빵", hint: "겨울 길거리의 생선 모양 빵, 팥이 들었다" },
      { answer: "호떡", hint: "기름에 지진 반죽 속에 흑설탕 꿀" },
      { answer: "순대", hint: "분식집에서 떡볶이와 짝꿍, 당면이 들었다" },
      { answer: "라면", hint: "물 550ml, 4분 30초" },
      { answer: "치킨", hint: "튀긴 닭, 맥주와 함께라면 치맥" },
      { answer: "만두", hint: "속을 채워 빚은 뒤 찌거나 굽거나 튀긴다" },
      { answer: "갈비찜", hint: "명절 상에 오르는 달짝지근한 고기 요리" },
      { answer: "미역국", hint: "생일 아침에 먹는 국" },
      { answer: "김치찌개", hint: "잘 익은 김치에 돼지고기 넣고 보글보글" },
      { answer: "잡채", hint: "당면에 채소와 고기를 볶아 무친 잔치 음식" },
      { answer: "팥빙수", hint: "얼음 위에 팥과 떡, 여름 디저트" },
      { answer: "수박", hint: "초록 껍질에 빨간 속, 여름 과일" },
      { answer: "식혜", hint: "밥알이 동동 뜨는 달콤한 전통 음료" },
      { answer: "칼국수", hint: "칼로 썰어 만든 면을 넣은 국수" },
      { answer: "부대찌개", hint: "햄과 소시지, 라면 사리를 넣은 찌개" },
      { answer: "고구마", hint: "답답한 상황을 비유할 때도 쓰는 군것질거리" },
      { answer: "탕수육", hint: "부먹? 찍먹?" },
      { answer: "아이스크림", hint: "차갑고 달콤한, 콘이나 컵에 담는 디저트" },
    ],
  },
  {
    slug: "animal",
    name: "동물",
    words: [
      { answer: "고양이", hint: "집사를 거느리는 동물" },
      { answer: "강아지", hint: "꼬리를 흔들며 반기는 반려동물" },
      { answer: "호랑이", hint: "옛날이야기에서 곶감을 무서워한 동물" },
      { answer: "코끼리", hint: "긴 코로 물을 뿌리는 가장 큰 육지 동물" },
      { answer: "기린", hint: "목이 아주 긴 동물" },
      { answer: "펭귄", hint: "날지 못하고 뒤뚱뒤뚱 걷는 남극의 새" },
      { answer: "다람쥐", hint: "볼에 도토리를 가득 넣는 동물" },
      { answer: "거북이", hint: "토끼와 달리기 시합에서 이긴 동물" },
      { answer: "토끼", hint: "깡충깡충, 긴 귀" },
      { answer: "원숭이", hint: "바나나를 좋아하고 나무를 잘 타는 동물" },
      { answer: "고래", hint: "바다에 사는 가장 큰 포유류" },
      { answer: "사자", hint: "갈기가 멋진 초원의 왕" },
      { answer: "판다", hint: "대나무를 먹는 흑백 곰" },
      { answer: "햄스터", hint: "쳇바퀴를 돌리는 작은 반려동물" },
      { answer: "오리", hint: "꽥꽥, 물에 둥둥" },
      { answer: "부엉이", hint: "밤에 깨어 있는 눈이 큰 새" },
      { answer: "악어", hint: "강가에 사는 입이 큰 파충류" },
      { answer: "고슴도치", hint: "등에 가시가 가득한 작은 동물" },
      { answer: "개구리", hint: "올챙이가 자라면?" },
      { answer: "나비", hint: "애벌레와 번데기를 거쳐 날개를 펴는 곤충" },
      { answer: "까치", hint: "반가운 손님이 온다는 소식을 전하는 새" },
      { answer: "얼룩말", hint: "검은 줄무늬가 있는 말" },
      { answer: "캥거루", hint: "주머니에 새끼를 넣고 다니는 동물" },
      { answer: "두더지", hint: "땅굴을 파며 사는 동물, 게임으로도 유명" },
      { answer: "돌고래", hint: "똑똑하고 초음파로 소통하는 바다 동물" },
    ],
  },
  {
    slug: "it",
    name: "IT·인터넷",
    words: [
      { answer: "컴퓨터", hint: "본체와 모니터, 키보드" },
      { answer: "스마트폰", hint: "손안의 작은 컴퓨터" },
      { answer: "인터넷", hint: "전 세계 컴퓨터를 잇는 통신망" },
      { answer: "비밀번호", hint: "로그인할 때 남몰래 입력하는 것" },
      { answer: "와이파이", hint: "카페에 가면 먼저 찾는 무선 인터넷" },
      { answer: "키보드", hint: "글자를 입력하는 자판" },
      { answer: "마우스", hint: "책상 위에서 움직이며 클릭하는 장치" },
      { answer: "블로그", hint: "글을 꾸준히 올리는 개인 웹 공간" },
      { answer: "검색", hint: "궁금한 걸 찾아보는 일" },
      { answer: "이메일", hint: "@가 들어가는 전자 편지" },
      { answer: "프로그램", hint: "컴퓨터에게 일을 시키는 명령 묶음" },
      { answer: "클라우드", hint: "내 파일을 인터넷 너머 서버에 보관하는 것" },
      { answer: "도메인", hint: "웹사이트의 주소 이름, 예: saintjw.dev" },
      { answer: "서버", hint: "요청을 받아 데이터를 내어 주는 컴퓨터" },
      { answer: "해킹", hint: "남의 시스템에 몰래 침입하는 일" },
      { answer: "백신", hint: "컴퓨터 바이러스를 잡는 프로그램" },
      { answer: "모니터", hint: "화면을 보여 주는 장치" },
      { answer: "충전기", hint: "배터리가 없을 때 급하게 찾는 것" },
      { answer: "인공지능", hint: "사람처럼 배우고 판단하는 기술, AI" },
      { answer: "알고리즘", hint: "문제를 푸는 절차, 추천 피드의 비밀" },
      { answer: "데이터", hint: "숫자, 글, 사진 같은 정보 조각" },
      { answer: "다운로드", hint: "인터넷에서 내 기기로 내려받기" },
      { answer: "로그인", hint: "아이디와 비밀번호로 들어가기" },
      { answer: "유튜브", hint: "영상을 올리고 보는 플랫폼" },
      { answer: "이모티콘", hint: "메신저에서 감정을 그림으로 표현" },
    ],
  },
  {
    slug: "place",
    name: "나라·도시",
    words: [
      { answer: "서울", hint: "대한민국의 수도" },
      { answer: "부산", hint: "해운대와 광안리가 있는 항구 도시" },
      { answer: "제주도", hint: "돌, 바람, 여자가 많다는 섬" },
      { answer: "경주", hint: "불국사와 첨성대가 있는 천년 고도" },
      { answer: "전주", hint: "한옥마을과 비빔밥으로 유명한 도시" },
      { answer: "강릉", hint: "커피 거리와 경포대가 있는 동해안 도시" },
      { answer: "일본", hint: "도쿄가 수도인 이웃 나라" },
      { answer: "미국", hint: "자유의 여신상이 있는 나라" },
      { answer: "프랑스", hint: "에펠탑이 있는 나라" },
      { answer: "이탈리아", hint: "피자와 파스타, 장화 모양의 나라" },
      { answer: "영국", hint: "빅벤과 런던이 있는 나라" },
      { answer: "독일", hint: "맥주 축제와 베를린의 나라" },
      { answer: "중국", hint: "만리장성이 있는 나라" },
      { answer: "베트남", hint: "쌀국수의 나라" },
      { answer: "호주", hint: "캥거루와 오페라 하우스의 나라" },
      { answer: "캐나다", hint: "단풍잎이 국기에 그려진 나라" },
      { answer: "브라질", hint: "삼바와 축구, 리우 카니발" },
      { answer: "이집트", hint: "피라미드와 스핑크스" },
      { answer: "스위스", hint: "알프스와 시계, 치즈의 나라" },
      { answer: "인도", hint: "타지마할과 카레의 나라" },
      { answer: "태국", hint: "똠얌꿍과 방콕" },
      { answer: "스페인", hint: "가우디의 건축과 플라멩코" },
      { answer: "뉴욕", hint: "타임스스퀘어가 있는 미국 도시" },
      { answer: "파리", hint: "프랑스의 수도, 루브르 박물관" },
      { answer: "인천", hint: "국제공항이 있는 항구 도시" },
    ],
  },
];

const ALL_ANSWERS = categories.flatMap((c) => c.words.map((w) => w.answer));

/** 출제 단어가 아니어도, 문제 목록에 있는 단어 중 초성이 같은 단어면 정답으로 인정한다. */
export function isAccepted(guess: string, answer: string): boolean {
  const g = normalize(guess);
  if (g === normalize(answer)) return true;
  const cho = toChosung(answer);
  return ALL_ANSWERS.some((a) => normalize(a) === g && toChosung(a) === cho);
}
