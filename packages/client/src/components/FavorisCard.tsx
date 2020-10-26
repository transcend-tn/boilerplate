import React, { useState } from 'react';
import Card from 'react-bootstrap/esm/Card';
import Media from 'react-bootstrap/esm/Media';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export interface FavorisCardProps {
  id: string;
  star?: boolean;
  timeEdit: string;
  document: string;
}

const favOn = '#f5bf42';
const favOff = '#808080';

function FavorisCard(props: FavorisCardProps) {
  const { document, timeEdit, id, star } = props;
  const [color, setColor] = useState(star ? favOn : favOff);

  function toggleColor() {
    setColor(color === favOn ? favOff : favOn);
  }

  return (
    <Card className="mb-2">
      <Media className="p-2 align-items-stretch">
        <Media.Body className="d-flex justify-content-between align-items-center">
          <div>
            <Link to={`document/${id}`} style={{ color: '#000000' }}>
              <h6 className="mb-0"> {document} </h6>
            </Link>
            <p className="mb-0 font-weight-light"> {timeEdit} </p>
          </div>
          <FaStar color={color} onClick={toggleColor} style={{ fontSize: 25 }} />
        </Media.Body>
      </Media>
    </Card>
  );
}

export default FavorisCard;
