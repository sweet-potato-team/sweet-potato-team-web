import React, { useEffect, useRef } from 'react';
import WordCloud from 'wordcloud';

function WordCloudComponent({ wordList, minFrequency = 2 }) {
    const wordCloudRef = useRef(null);

    useEffect(() => {
        if (wordCloudRef.current && wordList.length > 0) {
            console.log('Starting WordCloud rendering...');
            const wordCounts = {};
            
            // 計算每個單詞的頻率
            wordList.forEach(text => {
                text.split(' ').forEach(word => {
                    wordCounts[word] = (wordCounts[word] || 0) + 1;
                });
            });

            // 篩選出現頻率大於等於 minFrequency 的詞語
            const filteredWordCounts = Object.entries(wordCounts).filter(([word, count]) => count >= minFrequency);

            // 構建 WordCloud 資料
            const wordCloudData = filteredWordCounts.map(([word, count]) => [word, count]);

            // 渲染詞雲
            WordCloud(wordCloudRef.current, {
                list: wordCloudData,
                gridSize: 10,
                weightFactor: size => size * 20,
                fontFamily: 'GenSenRounded, Arial Unicode MS, SimHei, sans-serif',
                color: 'random-dark',
                backgroundColor: '#ffffff',
                rotateRatio: 0,
                shape: 'circle',
                drawOutOfBound: true,
            });
            console.log('WordCloud successfully rendered.');
        }
    }, [wordList, minFrequency]);

    return <div ref={wordCloudRef} style={{ minWidth: '400px',width: '100%', height: '400px', backgroundColor: '#ffffff' }} />;
}

export default WordCloudComponent;
