import React from 'react';
import Card from 'react-bootstrap/esm/Card';
import Image from 'react-bootstrap/esm/Image';
import Media from 'react-bootstrap/esm/Media';

export interface MemberCardInterface {
  username: string;
  img?: string;
}

const IMG_DEFAULT = 'user.png';

function MemberCard(props: MemberCardInterface) {
  return (
    <Card className="mb-2">
      <Media className="p-2 align-items-stretch">
        <Image src={props.img ? props.img : IMG_DEFAULT} roundedCircle width={50} height={50} className="mr-2" />
        <Media.Body className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-0">{props.username}</h6>
            <p className="mb-0 font-weight-light">Member</p>
          </div>
        </Media.Body>
      </Media>
    </Card>
  );
}

export default MemberCard;
