import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { DiaryPage } from "@/components/Diary";

export const metadata = pageMetadata(
  "개인정보처리방침",
  "saintjw.dev가 방문자 정보를 어떻게 다루는지, 광고와 쿠키를 어떻게 쓰는지 안내합니다.",
);

const UPDATED = "2026년 11월 16일";

export default function PrivacyPage() {
  return (
    <DiaryPage
      color="blue"
      title="개인정보처리방침"
      intro={<p>이 사이트가 방문자 정보를 어떻게 다루는지 정리해 둔 페이지예요.</p>}
    >
      <div className="prose mt-10 max-w-none">
        <p>
          saintjw.dev(이하 &lsquo;이 사이트&rsquo;)는 개인이 운영하는 블로그이자 작은 웹 도구 모음입니다.
          회원가입 기능이 없고, 운영자가 방문자의 이름·연락처 같은 개인정보를 직접 수집하지 않습니다.
        </p>

        <h2>1. 광고와 쿠키</h2>
        <p>
          이 사이트는 Google AdSense를 통해 광고를 게재합니다. Google을 포함한 제3자 광고 사업자는
          쿠키를 사용해 방문자가 이 사이트나 다른 웹사이트를 방문한 기록을 바탕으로 광고를 보여줄 수 있습니다.
        </p>
        <ul>
          <li>
            Google은 광고 쿠키를 사용해 이 사이트와 다른 사이트 방문 기록에 기반한 광고를 제공합니다.
          </li>
          <li>
            맞춤 광고를 원하지 않으면{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              Google 광고 설정
            </a>
            에서 끌 수 있습니다. 제3자 사업자의 맞춤 광고는{" "}
            <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">
              aboutads.info
            </a>
            에서 거부할 수 있습니다.
          </li>
          <li>
            Google이 데이터를 사용하는 방식은{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites?hl=ko"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google 파트너 사이트 데이터 사용 정책
            </a>
            에서 확인할 수 있습니다.
          </li>
          <li>브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있습니다.</li>
        </ul>

        <h2>2. 이야기방(Q&amp;A)</h2>
        <p>
          <Link href="/qna">이야기방</Link>에 질문을 남기면 입력한 닉네임과 질문 내용, 작성 시각이 저장됩니다.
          이 정보는 질문에 답하고 답변한 공개 질문을 보여 주는 데에만 쓰이며, 데이터베이스 서비스(Upstash)에
          보관됩니다. 비공개로 남긴 질문은 질문할 때 받은 확인 링크로만 볼 수 있습니다.
        </p>
        <ul>
          <li>
            스팸을 막기 위해 Cloudflare Turnstile로 자동 입력 여부를 확인하며, 이 과정에서 Cloudflare가 브라우저
            정보를 처리할 수 있습니다.
          </li>
          <li>
            너무 잦은 작성을 막기 위해 IP 주소를 되돌릴 수 없는 형태(해시)로 바꿔 최대 15분 동안만 사용하고,
            IP 주소 자체는 저장하지 않습니다.
          </li>
          <li>남긴 질문의 삭제를 원하면 이야기방에 확인 링크 주소와 함께 요청해 주세요.</li>
        </ul>

        <h2>3. 지난 방명록</h2>
        <p>
          <Link href="/guestbook">지난 방명록</Link>은 GitHub Discussions 기반의 Giscus로 운영됩니다.
          글을 남기려면 GitHub 계정으로 로그인해야 하며, 작성한 내용과 GitHub 프로필은 GitHub에 공개적으로
          저장됩니다. 이 정보는{" "}
          <a
            href="https://docs.github.com/ko/site-policy/privacy-policies/github-general-privacy-statement"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub 개인정보처리방침
          </a>
          을 따릅니다.
        </p>

        <h2>4. 브라우저에 저장되는 정보</h2>
        <p>
          화면 테마(밝게/어둡게) 설정이나 정산 도구에 입력한 내용은 방문자의 브라우저(localStorage)에만
          저장되며 서버로 전송되지 않습니다. 브라우저 데이터를 지우면 함께 삭제됩니다.
        </p>

        <h2>5. 접속 기록</h2>
        <p>
          사이트는 Vercel에서 호스팅되며, 서비스 운영과 보안을 위해 IP 주소·브라우저 종류 같은 접속 기록이
          호스팅 업체에 일시적으로 남을 수 있습니다. 운영자는 이를 방문자 식별에 사용하지 않습니다.
        </p>

        <h2>6. 문의</h2>
        <p>
          이 방침이나 사이트에 관한 문의는 <Link href="/qna">이야기방</Link>에 남겨 주세요. 비공개로 질문할 수도
          있습니다.
        </p>

        <p className="text-sm text-muted">시행일: {UPDATED}</p>
      </div>
    </DiaryPage>
  );
}
