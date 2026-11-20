---
title: 패스키를 다른 비밀번호 관리자로 옮기는 표준, CXP와 CXF
description: 패스키를 앱 사이에서 안전하게 옮기기 위해 FIDO 얼라이언스가 만들고 있는 CXP와 CXF가 무엇이고 어떻게 동작하는지 쉽게 정리했습니다.
date: '2026-11-21'
topic: tech-explained
tags: [패스키, FIDO, CXP, CXF, 비밀번호 관리자, 보안]
draft: false
---

패스키는 편하지만, 쓰던 비밀번호 관리자를 바꿀 때가 되면 고민이 생깁니다. 저장해 둔 패스키를 새 앱으로 어떻게 옮기느냐는 문제입니다. 이 글에서는 이 문제를 풀려고 FIDO 얼라이언스가 문서로 만들고 있는 CXP와 CXF가 무엇인지, 어떤 방식으로 옮기는지 정리합니다. 패스키 자체가 낯설다면 먼저 [패스키 글](/posts/passkeys-explained-simply)을 읽어 보시면 좋습니다.

## 왜 옮기기가 어려웠나

비밀번호는 글자라서 복사해서 붙이면 끝입니다. 패스키는 다릅니다. 패스키 안에는 기기나 앱이 보관하는 비밀 열쇠가 있고, 이 열쇠는 밖으로 꺼내지 않는 것을 전제로 설계됐습니다. 그래서 앱마다 저장 방식이 다르고, 앱 사이에 옮겨 주는 공통된 방법도 없었습니다.

기존에 쓰던 방법은 CSV나 JSON 같은 파일로 내보내는 것입니다. 이 방식은 앱마다 항목 이름과 구조가 달라서 호환이 잘 안 되고, 파일이 암호화되지 않은 채 기기에 남을 수 있다는 약점이 있습니다. 비밀 열쇠가 평범한 파일로 돌아다니면 패스키가 주는 안전함이 줄어듭니다.

## CXP와 CXF는 무엇인가

FIDO 얼라이언스가 공개한 문서에 따르면 두 이름은 역할이 다릅니다.

- **CXP(Credential Exchange Protocol)**: 두 앱이 서로 자격 증명을 안전하게 주고받는 절차입니다. 같은 기기 안이든 다른 기기든 쓸 수 있도록 설계됐습니다.
- **CXF(Credential Exchange Format)**: 주고받는 내용을 어떤 모양으로 담을지 정한 데이터 형식입니다.

비유하면 이사와 같습니다. CXP는 이삿짐 업체가 지키는 절차(누가 어떻게 문을 열고 짐을 받는지)이고, CXF는 모든 짐을 같은 규격의 상자에 담자는 약속입니다. 상자 규격이 같아야 어느 업체의 집이든 짐을 풀 수 있습니다.

## 옮기는 과정

문서와 이를 해설한 자료를 종합하면 흐름은 대략 이렇습니다.

![패스키를 옮길 때 보안 채널 만들기, 표준 형식으로 담기, 확인하고 저장하기의 세 단계를 보여 주는 그림](/images/posts/passkey-transfer-cxp-cxf-explained/passkey-transfer-steps.png "패스키 이동의 세 단계")

1. 두 앱이 디피-헬먼 방식의 키 교환으로 이번 이동에만 쓰는 암호화된 통로를 만듭니다. 문서는 하이브리드 공개 키 암호(HPKE)도 지원한다고 설명합니다.
2. 내보내는 앱이 자격 증명을 CXF 형식으로 담아 그 통로로 보냅니다.
3. 가져오는 앱이 내용을 확인하고 자기 저장소에 보관합니다.

이 방식은 인터넷이 없는 환경에서도 쓸 수 있도록 설계됐다고 문서에 적혀 있습니다. 중요한 점은 사용자가 평문 파일을 따로 만들 필요가 없다는 것입니다.

![파일로 내보내는 예전 방식과 CXP와 CXF 방식을 암호화 여부와 형식, 파일 생성 여부로 비교한 그림](/images/posts/passkey-transfer-cxp-cxf-explained/export-file-vs-cxp.png "예전 내보내기와 CXP/CXF 비교")

## 누가 만들고, 지금은 어디까지 왔나

공개된 문서의 편집자와 참여자에는 1Password, Dashlane, Bitwarden, NordPass, 구글이 있고, 애플과 마이크로소프트 등도 관련 그룹에 이름을 올리고 있습니다. 다만 제가 확인한 FIDO 문서는 "작업 초안(Working Draft)"이라고 표시돼 있고, 확정된 합의 사항이 아니라는 문구가 붙어 있습니다. 제가 본 판은 2024년 날짜이므로 그 뒤에 개정됐을 수 있습니다.

실제 제품 지원은 별도로 확인해야 합니다. 한 패스키 업체의 블로그는 안드로이드 17이 구글 플레이 서비스 26.21부터 CXP와 CXF를 지원하고 iOS 26도 CXP를 구현한다고 소개합니다. 하지만 이 내용은 한 곳의 글에서 가져온 것이고, 구글이나 애플의 공식 문서로 직접 확인하지 못했습니다. 어떤 앱이 실제로 지원하는지는 사용하는 앱의 공지를 보시는 것이 정확합니다.

## 쓰는 입장에서 기억할 점

- 관리자를 바꾸기 전에 지금 앱과 옮길 앱이 모두 패스키 이동을 지원하는지 확인합니다.
- 지원하지 않는다면 서비스별로 새 패스키를 다시 등록하는 방법이 있습니다. 기존 패스키는 바로 지우지 말고 새 것으로 로그인이 되는지 확인한 뒤에 정리합니다.
- 파일로 내보내는 기능을 쓴다면 작업이 끝난 뒤 파일을 반드시 지웁니다.

CXP와 CXF가 자리를 잡으면 패스키는 한 회사의 앱에 묶이지 않고 사용자가 앱을 고르는 쪽으로 한 걸음 더 가게 됩니다. 아직은 초안 단계의 문서가 많으니, 앞으로 각 앱이 지원을 밝히는지 지켜볼 일입니다.

## 참고한 자료

- [Credential Exchange Protocol (FIDO Alliance 작업 초안)](https://fidoalliance.org/specs/cx/cxp-v1.0-wd-20241003.html)
- [Credential Exchange Format (FIDO Alliance 작업 초안)](https://fidoalliance.org/specs/cx/cxf-v1.0-wd-20241003.html)
- [FIDO Alliance Publishes New Specifications to Promote User Choice and Enhanced UX for Passkeys](https://fidoalliance.org/fido-alliance-publishes-new-specifications-to-promote-user-choice-and-enhanced-ux-for-passkeys/)
- [Android 17 Passkeys: What's New for Credentials? (Corbado, 업체 블로그)](https://www.corbado.com/blog/android-17-passkeys)
