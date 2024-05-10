import styled from 'styled-components';
import { useEffect, useState } from 'react';

const NewsItemContainer = styled.span`
  font-size: 16px;
  color: #ffffff;
  max-width: 230px;
  white-space: normal;
  word-break: break-all;
  //border: ;
`;
const NewsContents = styled.p``;

const NewsItem = ({ news }) => {
  const [category, setCategory] = useState('');
  // console.log('news : ', news);

  useEffect(() => {
    switch (news.category) {
      case 'business':
        setCategory('경제');
        break;
      case 'world':
        setCategory('세계');
        break;
      case 'sports':
        setCategory('스포츠');
        break;
      case 'technology':
        setCategory('기술');
        break;
      case 'politics':
        setCategory('정치');
        break;
      default:
        setCategory('기타');
        break;
    }
  }, [news.category]);

  return (
    <NewsItemContainer>
      <NewsContents>{news.title}</NewsContents>
      <NewsContents>{category + ' : '}</NewsContents>
      <NewsContents>{news.description}</NewsContents>
      <NewsContents>
        자세히 보기 : <a href={news.link}>{news.link}</a>
      </NewsContents>
    </NewsItemContainer>
  );
};

export default NewsItem;
