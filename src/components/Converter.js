import { useState } from 'react';
import { TbArrowsLeftRight, TbClick } from 'react-icons/tb';
import { ImConnection } from 'react-icons/im';
import { MdRefresh } from 'react-icons/md';
import Options from './Options';
import styles from './Converter.module.css';

function Converter() {
	const [data, setData] = useState(null);
  const [error, setError] = useState('');
	const [amount, setAmount] = useState(100);
	const [fromValue, setFromValue] = useState('USD');
	const [toValue, setToValue] = useState('UAH');
	const [showResultBox, setShowResultBox] = useState(false);	
	const apiKey = 'dfba807a3a179431156d7191';

	function invertSelectionHandler(event) {
		event.preventDefault();
		setFromValue(toValue);
		setToValue(fromValue);
		setShowResultBox(false);
	}
	
	const fetchData = async (event) => {
		try {
			event.preventDefault();
			const response = await fetch (`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromValue}/${toValue}/${amount}`);
			const data = await response.json();
			setData(data);
		} catch (error) {
			setError(error.message)
		}
		setShowResultBox(true);
	}

  if (error) {
    return (
			<div className={styles.errorMessage}><span>Error:</span> {error} 
				<div className={styles.errorAdvices}>
					Try to refresh the page
					<MdRefresh className={styles.errorIcon} />					
				</div>
				<div className={styles.errorAdvices}>
					Check your internet connection
					<ImConnection className={styles.errorIcon} />
				</div>
			</div>
		) 
  }

	return (
		<div className={styles.container}>
			<div className={styles.calculator}>
				<form>
					<div className={styles.inputGroupWrapper}>
						<div className={styles.inputGroup}>
							<div className={styles.labelWrapper}>
								<label>Amount</label>
							</div>
							<input 
								className={styles.amountInput}
								value={amount} 
								onChange={(event) => setAmount(event.target.value)} 
								onFocus={() => setShowResultBox(false)}
							/>
						</div>						
						<div className={styles.inputGroup}>
							<div className={styles.labelWrapper}>
									<label>From</label>
							</div>
							<div className={styles.inputSelection}>
								<select 									
									value={fromValue} 
									onChange={event => setFromValue(event.target.value)}
									onFocus={() => setShowResultBox(false)}
								>
									<Options />
								</select>
							</div>
						</div>
						<div className={styles.inputGroup}>
							<button 
								onClick={invertSelectionHandler}>
								<TbArrowsLeftRight />
							</button>
						</div>
						<div className={styles.inputGroup}>
							<div className={styles.labelWrapper}>
								<label>To</label>
							</div>
							<div className={styles.inputSelection}>
								<select
									value={toValue}
									onChange={event => setToValue(event.target.value)}
									onFocus={() => setShowResultBox(false)}
								>
									<Options />
								</select>
							</div>
						</div>
						<button onClick={fetchData}>
							<TbClick />
						</button>
					</div>
				</form>
				{showResultBox && (
					<div className={styles.resultBox}>
						{(data) && (data.conversion_result).toFixed(2)} {toValue}	
						{data && <div>1 {fromValue} = {(data.conversion_rate).toFixed(2)} {toValue}</div>}
					</div>
				)}
			</div>
		</div>
	)
}

export default Converter;