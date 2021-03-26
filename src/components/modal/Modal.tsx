import React, { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef } from "react";
import { ModalSize } from "./ModalSize";

declare const window: any;

export interface ModalRef {
	open: () => void,
	close: () => void,
}

interface ModalProps {
	header: string,
	children: ReactNode,
	actions?: ReactNode | undefined,
	size?: ModalSize,
}

const Modal = forwardRef<ModalRef, ModalProps>((props, ref) => {

	const modal = useRef(null);
	const modalInstance = useRef<any>(null);

	useEffect(() => {
		modalInstance.current = window.FPDS.Modal.init(modal.current);
	}, [modal, modalInstance]);

	useImperativeHandle(
		ref,
		() => ({
			open() {
				modalInstance.current.open();
			},
			close() {
				modalInstance.current.close();
			}
		}),
	)

	return <div id="modal1" className={`fpds-Modal fpds-Modal--dialog fpds-Modal--${ModalSize[props.size || ModalSize.medium]}`} ref={modal}>
		<div className="fpds-Modal-container fpds-Body">
			<div className="fpds-Modal-header">
				<div className="fpds-Modal-heading">{props.header}</div>
			</div>
			<div className="fpds-Modal-body">
				{props.children}
			</div>
			<div className="fpds-Modal-footer">
				{props.actions}
			</div>
			<button type="button" className="fpds-Modal-close fpds-Button fpds-Button--icon fpds-Button--subtle">
				<i className="fpds-Icon fpds-Icon--small">close</i>
			</button>
		</div>
	</div>;
})

export default Modal;

