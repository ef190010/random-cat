// page component
import { NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

// ページコンポーネント関数
const IndexPage: NextPage = () => {
    // 状態(imageUrl, loading)の定義
    //  imageUrl: 画像URL, loading: API呼び出し中
    // useState()の引数は初期値
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(true);

    // 画像の読み込み①：ページ更新時
    //  useEffect(): 第1引数の処理内容を第2引数のタイミングで実行する
    //   第1引数にはasync関数を渡せないので、thenで記述する
    //   第2引数が[]のとき、「コンポーネントのマウント時」
    useEffect(() => {
        fetchImage().then((newImage) => {
            setImageUrl(newImage.url);
            setLoading(false);
        });
    }, []);

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
        <div className={ styles.page }>
            <button onClick={ handleClick } className={ styles.button }>See another cat!</button>
            <div className={ styles.frame }>
                { loading || <img src={ imageUrl } className={ styles.img }/> }
            </div>
        </div>
    );
};

export default IndexPage;

// 画像取得関数の戻り値の型定義
type Image = {
    // 必要なプロパティのみ型定義する
    url: string;
}
// 画像取得関数
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

// fetchImage().then((img) => {
//     console.log(img.url);
// });