import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Text,
  HStack,
  VStack,
  Badge,
  Button,
  Image,
  Flex,
  useColorModeValue,
  Link,
  Avatar,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { ExternalLink, Clock, Eye, MessageCircle, Bookmark, Share2 } from 'react-feather';
import StatusTag, { TagCategory, getTagCategory } from '../common/StatusTag';
import StatusPill, { PillVariant } from '../common/StatusPill';

export interface NewsCardProps {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  source: string;
  author?: string;
  publishedAt: string;
  url: string;
  category?: string;
  priority?: PillVariant;
  relevance?: number;
  readTime?: number;
  views?: number;
  comments?: number;
  variant?: 'default' | 'compact' | 'featured' | 'minimal';
  loading?: boolean;
  onBookmark?: () => void;
  onShare?: () => void;
  onRead?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  excerpt,
  imageUrl,
  source,
  author,
  publishedAt,
  url,
  category,
  priority,
  relevance,
  readTime,
  views,
  comments,
  variant = 'default',
  loading = false,
  onBookmark,
  onShare,
  onRead,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Agora';
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <Card borderRadius="16px" bg={bgColor} borderColor={borderColor} borderWidth="1px">
        <CardBody>
          <VStack align="stretch" spacing={3}>
            <HStack spacing={3}>
              <Skeleton height="40px" width="60px" />
              <VStack align="start" flex={1} spacing={1}>
                <Skeleton height="12px" width="80px" />
                <Skeleton height="10px" width="120px" />
              </VStack>
            </HStack>
            <SkeletonText noOfLines={2} spacing="2" />
            <Skeleton height="15px" width="150px" />
          </VStack>
        </CardBody>
      </Card>
    );
  }

  const renderMinimal = () => (
    <Card borderRadius="16px" bg={bgColor} borderColor={borderColor} borderWidth="1px" size="sm">
      <CardBody p={3}>
        <VStack align="stretch" spacing={2}>
          <HStack spacing={2} align="start">
            {priority && (
              <StatusPill variant={priority} size="sm">
                {relevance ? `${relevance}%` : 'Relevante'}
              </StatusPill>
            )}
            <VStack align="start" flex={1} spacing={1}>
              <Link href={url} isExternal fontSize="sm" fontWeight="medium" 
                    color="blue.600" _hover={{ color: 'blue.800' }}
                    onClick={onRead}>
                {title}
              </Link>
              <HStack spacing={4} fontSize="xs" color={textColor}>
                <HStack spacing={1}>
                  <Clock size={12} />
                  <Text>{formatDate(publishedAt)}</Text>
                </HStack>
                <Text>{source}</Text>
                {readTime && (
                  <HStack spacing={1}>
                    <Text>{readTime} min</Text>
                  </HStack>
                )}
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );

  const renderCompact = () => (
    <Card borderRadius="16px" bg={bgColor} borderColor={borderColor} borderWidth="1px">
      <CardBody p={4}>
        <HStack spacing={3} align="start">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              boxSize="60px"
              objectFit="cover"
              borderRadius="16px"
              fallbackSrc="https://via.placeholder.com/60x60?text=News"
            />
          )}
          <VStack align="start" flex={1} spacing={2}>
            <HStack spacing={2} flexWrap="wrap">
              {category && (
                <StatusTag category={getTagCategory(category)} size="sm">
                  {category}
                </StatusTag>
              )}
              {priority && (
                <StatusPill variant={priority} size="sm">
                  {relevance ? `${relevance}%` : 'Relevante'}
                </StatusPill>
              )}
            </HStack>
            <Link href={url} isExternal fontSize="md" fontWeight="semibold"
                  color="gray.800" _hover={{ color: 'blue.600' }}
                  onClick={onRead} lineHeight="1.3">
              {title}
            </Link>
            <HStack spacing={4} fontSize="sm" color={textColor}>
              <HStack spacing={1}>
                <Clock size={14} />
                <Text>{formatDate(publishedAt)}</Text>
              </HStack>
              <Text>{source}</Text>
              {readTime && <Text>{readTime} min</Text>}
            </HStack>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );

  const renderFeatured = () => (
    <Card borderRadius="16px" bg={bgColor} borderColor={borderColor} borderWidth="1px" size="lg">
      <CardHeader pb={3}>
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <HStack spacing={2}>
              {category && (
                <StatusTag category={getTagCategory(category)} size="md">
                  {category}
                </StatusTag>
              )}
              {priority && (
                <StatusPill variant={priority} size="md">
                  {relevance ? `${relevance}% relevante` : 'Alta prioridade'}
                </StatusPill>
              )}
            </HStack>
            <HStack spacing={3} fontSize="sm" color={textColor}>
              <HStack spacing={1}>
                <Clock size={14} />
                <Text>{formatDate(publishedAt)}</Text>
              </HStack>
              <Text>{source}</Text>
              {author && <Text>por {author}</Text>}
            </HStack>
          </VStack>
          <HStack spacing={1}>
            {onBookmark && (
              <Button size="sm" variant="ghost" onClick={onBookmark}>
                <Bookmark size={16} />
              </Button>
            )}
            {onShare && (
              <Button size="sm" variant="ghost" onClick={onShare}>
                <Share2 size={16} />
              </Button>
            )}
          </HStack>
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        <VStack align="stretch" spacing={4}>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              w="100%"
              h="200px"
              objectFit="cover"
              borderRadius="16px"
              fallbackSrc="https://via.placeholder.com/400x200?text=News"
            />
          )}
          <VStack align="start" spacing={3}>
            <Link href={url} isExternal fontSize="xl" fontWeight="bold"
                  color="gray.800" _hover={{ color: 'blue.600' }}
                  onClick={onRead} lineHeight="1.4">
              {title}
            </Link>
            {excerpt && (
              <Text color={textColor} fontSize="md" lineHeight="1.5">
                {excerpt}
              </Text>
            )}
            <HStack justify="space-between" w="100%">
              <HStack spacing={4} fontSize="sm" color={textColor}>
                {readTime && (
                  <HStack spacing={1}>
                    <Clock size={14} />
                    <Text>{readTime} min de leitura</Text>
                  </HStack>
                )}
                {views && (
                  <HStack spacing={1}>
                    <Eye size={14} />
                    <Text>{views}</Text>
                  </HStack>
                )}
                {comments && (
                  <HStack spacing={1}>
                    <MessageCircle size={14} />
                    <Text>{comments}</Text>
                  </HStack>
                )}
              </HStack>
              <Button size="sm" rightIcon={<ExternalLink size={14} />}
                      as={Link} href={url} isExternal onClick={onRead}>
                Ler mais
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );

  const renderDefault = () => (
    <Card borderRadius="16px" bg={bgColor} borderColor={borderColor} borderWidth="1px">
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between" align="start">
            <HStack spacing={2}>
              {category && (
                <StatusTag category={getTagCategory(category)} size="sm">
                  {category}
                </StatusTag>
              )}
              {priority && (
                <StatusPill variant={priority} size="sm">
                  {relevance ? `${relevance}%` : 'Relevante'}
                </StatusPill>
              )}
            </HStack>
            <HStack spacing={1}>
              {onBookmark && (
                <Button size="xs" variant="ghost" onClick={onBookmark}>
                  <Bookmark size={14} />
                </Button>
              )}
              {onShare && (
                <Button size="xs" variant="ghost" onClick={onShare}>
                  <Share2 size={14} />
                </Button>
              )}
            </HStack>
          </HStack>

          <Link href={url} isExternal fontSize="lg" fontWeight="semibold"
                color="gray.800" _hover={{ color: 'blue.600' }}
                onClick={onRead} lineHeight="1.4">
            {title}
          </Link>

          {excerpt && (
            <Text color={textColor} fontSize="sm" lineHeight="1.5" noOfLines={2}>
              {excerpt}
            </Text>
          )}

          <HStack justify="space-between">
            <HStack spacing={3} fontSize="sm" color={textColor}>
              <HStack spacing={1}>
                <Clock size={14} />
                <Text>{formatDate(publishedAt)}</Text>
              </HStack>
              <Text>{source}</Text>
              {readTime && <Text>{readTime} min</Text>}
            </HStack>
            {(views || comments) && (
              <HStack spacing={3} fontSize="sm" color={textColor}>
                {views && (
                  <HStack spacing={1}>
                    <Eye size={14} />
                    <Text>{views}</Text>
                  </HStack>
                )}
                {comments && (
                  <HStack spacing={1}>
                    <MessageCircle size={14} />
                    <Text>{comments}</Text>
                  </HStack>
                )}
              </HStack>
            )}
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );

  switch (variant) {
    case 'minimal':
      return renderMinimal();
    case 'compact':
      return renderCompact();
    case 'featured':
      return renderFeatured();
    default:
      return renderDefault();
  }
};

export default NewsCard;