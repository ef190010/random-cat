// page component
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";

// getServerSideProps()の戻り値の型定義
type Props = {
    initialImageUrl: string;
};

// ページコンポーネント関数
const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
    // 状態(imageUrl, loading)の定義
    //  imageUrl: 画像URL, loading: API呼び出し中
    // useState()の引数は初期値
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const [loading, setLoading] = useState(false);

    // // 画像の読み込み①：ページ更新時
    // //  useEffect(): 第1引数の処理内容を第2引数のタイミングで実行する
    // //   第1引数にはasync関数を渡せないので、thenで記述する
    // //   第2引数が[]のとき、「コンポーネントのマウント時」
    // useEffect(() => {
    //     fetchImage().then((newImage) => {
    //         setImageUrl(newImage.url);
    //         setLoading(false);
    //     });
    // }, []);

    // 画像の読み込み②：ボタンクリック時
    const handleClick = async () => {
        setLoading(true);
        const newImage = await fetchImage();
        setImageUrl(newImage.url);
        setLoading(false);
    }

    // JSXを返す
    //  {}内にはJavaScriptの式だけが書ける（if文とかはダメ）
    return (
        <div>
            <button onClick={ handleClick }>他のにゃんこも見る</button>
            <div>{ loading || <img src={ imageUrl }></img> }</div>
        </div>
    );
};

export default IndexPage;

// サーバーサイドで実行する処理
//  getServerSideProps(): リクエスト時にサーバ側で実行され、プロパティを返す
//   Next.jsに認識させるためにexportする
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const image = await fetchImage();
    return {
        props: {
            // IndexPageが引数として受け取るpropを戻り値に含める
            initialImageUrl: image.url,
        }
    }
}

// 画像取得関数の戻り値の型定義
type Image = {
    // 必要なプロパティのみ型定義する
    url: string;
}
// 画像取得関数(CS)
const fetchImage = async (): Promise<Image> => {
    // fetch(): http request (return Response)
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images: unknown = await res.json();
    
    // validation
    if (!Array.isArray(images)) {
        throw new Error('unexpected type: images');
    }
    const image: unknown = images[0];
    if (!isImage(image)) {
        throw new Error('unexpected type: image');
    }

    // console.log(images);
    return image;
}

// 型ガード関数
const isImage = (val: unknown): val is Image => {
    if (!val || typeof val !== "object") {
        return false;
    }
    if (!("url" in val) || typeof val.url !== "string") {
        return false;
    }
    return true;
}
