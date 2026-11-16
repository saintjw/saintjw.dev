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
  {
    slug: "movie",
    name: "영화",
    words: [
      { answer: "기생충", hint: "봉준호 감독, 반지하 가족 이야기로 아카데미 작품상" },
      { answer: "부산행", hint: "KTX 안에서 벌어지는 좀비와의 사투" },
      { answer: "명량", hint: "이순신 장군과 열두 척의 배" },
      { answer: "극한직업", hint: "마약반 형사들이 위장 창업한 치킨집이 대박 난다" },
      { answer: "괴물", hint: "한강에 나타난 괴생물체, 봉준호 감독" },
      { answer: "올드보이", hint: "15년 동안 갇혀 있던 남자의 복수, 박찬욱 감독" },
      { answer: "해운대", hint: "부산 바닷가에 거대한 쓰나미가 덮친다" },
      { answer: "국제시장", hint: "흥남 철수부터 이어지는 한 아버지의 일생" },
      { answer: "베테랑", hint: '"어이가 없네", 재벌 3세를 쫓는 형사들' },
      { answer: "암살", hint: "1930년대 경성, 친일파를 처단하려는 작전" },
      { answer: "택시운전사", hint: "1980년 광주로 외국인 기자를 태우고 간 택시 기사" },
      { answer: "범죄도시", hint: "마동석이 괴물 형사로 활약하는 액션 시리즈" },
      { answer: "아바타", hint: "판도라 행성에 사는 푸른 피부의 나비족" },
      { answer: "타이타닉", hint: "침몰하는 거대한 여객선 위의 사랑" },
      { answer: "겨울왕국", hint: "얼음 마법을 쓰는 엘사와 동생 안나" },
      { answer: "인터스텔라", hint: "웜홀을 지나 인류가 살 행성을 찾는 우주 여행" },
      { answer: "어벤져스", hint: "마블 히어로들이 한 팀으로 뭉친다" },
      { answer: "알라딘", hint: "요술 램프와 소원을 들어주는 지니" },
      { answer: "해리포터", hint: "호그와트 마법 학교의 이마에 흉터가 있는 소년" },
      { answer: "토이스토리", hint: "카우보이 우디와 우주 전사 버즈" },
      { answer: "라이온킹", hint: "아기 사자 심바가 왕이 되기까지, 하쿠나 마타타" },
      { answer: "쥬라기 공원", hint: "공룡을 되살려 만든 테마파크" },
      { answer: "반지의 제왕", hint: "절대반지를 없애러 떠나는 호빗의 여정" },
      { answer: "왕의 남자", hint: "연산군 앞에서 놀이판을 벌이는 광대들" },
      { answer: "써니", hint: "학창 시절 칠공주 친구들을 25년 만에 다시 찾는다" },
    ],
  },
  {
    slug: "proverb",
    name: "속담",
    words: [
      { answer: "가는 말이 고와야 오는 말이 곱다", hint: "내가 남에게 잘해야 남도 나에게 잘한다" },
      { answer: "낮말은 새가 듣고 밤말은 쥐가 듣는다", hint: "아무도 안 듣는 것 같아도 말은 조심해야 한다" },
      { answer: "원숭이도 나무에서 떨어진다", hint: "아무리 잘하는 사람도 실수할 때가 있다" },
      { answer: "소 잃고 외양간 고친다", hint: "일을 그르친 뒤에야 손써 봐야 소용없다" },
      { answer: "티끌 모아 태산", hint: "작은 것도 모이면 크게 된다" },
      { answer: "누워서 떡 먹기", hint: "아주 하기 쉬운 일" },
      { answer: "고래 싸움에 새우 등 터진다", hint: "힘센 쪽끼리 싸우는데 약한 쪽이 피해를 본다" },
      { answer: "세 살 버릇 여든까지 간다", hint: "어릴 때 든 습관은 늙어서도 고치기 어렵다" },
      { answer: "백지장도 맞들면 낫다", hint: "쉬운 일이라도 힘을 합치면 더 쉽다" },
      { answer: "등잔 밑이 어둡다", hint: "가까이 있는 것을 오히려 잘 모른다" },
      { answer: "발 없는 말이 천 리 간다", hint: "말은 순식간에 멀리 퍼진다" },
      { answer: "바늘 도둑이 소도둑 된다", hint: "작은 나쁜 짓도 버릇이 되면 큰 죄가 된다" },
      { answer: "콩 심은 데 콩 나고 팥 심은 데 팥 난다", hint: "모든 결과에는 그만한 원인이 있다" },
      { answer: "하늘이 무너져도 솟아날 구멍이 있다", hint: "아무리 어려워도 헤쳐 나갈 길은 있다" },
      { answer: "돌다리도 두들겨 보고 건너라", hint: "잘 아는 일이라도 한 번 더 확인하라" },
      { answer: "금강산도 식후경", hint: "아무리 좋은 구경도 배가 불러야 즐겁다" },
      { answer: "꿩 먹고 알 먹는다", hint: "한 가지 일로 두 가지 이득을 본다" },
      { answer: "우물 안 개구리", hint: "넓은 세상을 모르는 사람" },
      { answer: "빈 수레가 요란하다", hint: "실속 없는 사람이 더 떠든다" },
      { answer: "개구리 올챙이 적 생각 못 한다", hint: "형편이 나아지면 어려웠던 때를 잊는다" },
      { answer: "시작이 반이다", hint: "일단 시작하면 절반은 한 셈이다" },
      { answer: "호랑이도 제 말 하면 온다", hint: "그 사람 이야기를 하면 마침 나타난다" },
      { answer: "아니 땐 굴뚝에 연기 날까", hint: "원인 없는 결과는 없다" },
      { answer: "될성부른 나무는 떡잎부터 알아본다", hint: "크게 될 사람은 어릴 때부터 남다르다" },
      { answer: "짚신도 짝이 있다", hint: "누구에게나 맞는 짝이 있다" },
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
